import React from 'react';
import {$getSelection, $isParagraphNode, $isRangeSelection, COMMAND_PRIORITY_HIGH, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_LEFT_COMMAND, KEY_ARROW_RIGHT_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {SlashMenu} from '../components/ui/SlashMenu';
import {CardMenu} from '../components/ui/CardMenu';
import {getSelectedNode} from '../utils/getSelectedNode';
import {getEditorCardNodes} from '../utils/getEditorCardNodes';
import {buildCardMenu} from '../utils/buildCardMenu';

function useSlashCardMenu(editor) {
    const [isShowingMenu, setIsShowingMenu] = React.useState(false);
    const [topPosition, setTopPosition] = React.useState(0);
    const [query, setQuery] = React.useState('');
    const [commandParams, setCommandParams] = React.useState([]);
    const [cardMenu, setCardMenu] = React.useState({});
    const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
    const cachedRange = React.useRef(null);
    const containerRef = React.useRef(null);

    function getTopPosition(elem) {
        const elemRect = elem.getBoundingClientRect();
        const containerRect = elem.parentNode.getBoundingClientRect();

        return elemRect.bottom - containerRect.top;
    }

    function moveCursorToCachedRange() {
        if (!cachedRange.current) {
            return;
        }
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(cachedRange.current);
    }

    const openMenu = React.useCallback(() => {
        setIsShowingMenu(true);
    }, [setIsShowingMenu]);

    const closeMenu = React.useCallback(({resetCursor = false} = {}) => {
        if (resetCursor) {
            moveCursorToCachedRange();
        }
        setIsShowingMenu(false);
        setQuery('');
        setCommandParams([]);
        cachedRange.current = null;
    }, [setIsShowingMenu]);

    const insert = React.useCallback((insertCommand, {insertParams = {}, queryParams = {}} = {}) => {
        const dataset = {...insertParams};

        for (let i = 0; i < queryParams.length; i++) {
            if (commandParams[i]) {
                const key = queryParams[i];
                const value = commandParams[i];
                dataset[key] = value;
            }
        }

        editor.update(() => {
            const selection = $getSelection();
            selection.modify('extend', true, 'lineboundary');
            selection.deleteCharacter(true);
            editor.dispatchCommand(insertCommand, dataset);
        });

        closeMenu();
    }, [editor, commandParams, closeMenu]);

    // close menu if selection moves out of the slash command
    // update the search query when typing
    React.useEffect(() => {
        return editor.registerUpdateListener(() => {
            editor.getEditorState().read(() => {
                // don't do anything when using IME input
                if (editor.isComposing()) {
                    return;
                }

                const selection = $getSelection();

                if (!$isRangeSelection(selection) || !selection.type === 'text' || !selection.isCollapsed()) {
                    closeMenu();
                    return;
                }

                const node = getSelectedNode(selection).getTopLevelElement();

                if (!node || !$isParagraphNode(node) || !node.getTextContent().startsWith('/')) {
                    closeMenu();
                    return;
                }

                const nativeSelection = window.getSelection();
                const anchorNode = nativeSelection.anchorNode;
                const rootElement = editor.getRootElement();

                if (anchorNode?.nodeType !== Node.TEXT_NODE || !rootElement.contains(anchorNode)) {
                    closeMenu();
                    return;
                }

                // store the cached range so we can reset the cursor when Escape is pressed
                // because that will _always_ blur the contenteditable which we don't want
                cachedRange.current = nativeSelection.getRangeAt(0);

                // capture text after the / as a query for filtering cards
                const command = node.getTextContent().slice(1);
                const [q, ...cps] = command.split(' ');
                setQuery(q);
                setCommandParams(cps);
            });
        });
    }, [editor, closeMenu, setQuery, setCommandParams]);

    // open the menu when / is pressed on a blank paragraph
    React.useEffect(() => {
        if (isShowingMenu) {
            return;
        }

        const triggerMenu = (event) => {
            const {key, isComposing, shiftKey, ctrlKey, metaKey, altKey} = event;

            // we only care about / presses when not composing or pressed with modifiers
            if (key !== '/' || isComposing || shiftKey || ctrlKey || metaKey || altKey) {
                return;
            }

            // ignore if editor doesn't have focus
            const rootElement = editor.getRootElement();
            if (!rootElement.matches(':focus')) {
                return;
            }

            // potentially valid / press
            editor.getEditorState().read(() => {
                const selection = $getSelection();
                const node = getSelectedNode(selection).getTopLevelElement();

                // ignore if selection is not on a top-level paragraph
                if (!node || !$isParagraphNode(node)) {
                    return;
                }

                const paragraphSize = node.getTextContentSize();
                const isEmptyParagraph = selection.isCollapsed() && node.getTextContent() === '';
                // if full paragraph is selected, pressing / will replace it so that's a valid press
                const isFullParagraphSelection = !selection.isCollapsed() && (
                    (selection.anchor.offset === 0 && selection.focus.offset === paragraphSize) ||
                    (selection.anchor.offset === paragraphSize && selection.focus.offset === 0)
                );

                if (isEmptyParagraph || isFullParagraphSelection) {
                    const nativeSelection = window.getSelection();
                    let selectionElem;

                    if (nativeSelection.anchorNode.nodeType === Node.TEXT_NODE) {
                        selectionElem = nativeSelection.anchorNode.parentNode.closest('p');
                    } else {
                        selectionElem = nativeSelection.anchorNode;
                    }

                    setTopPosition(getTopPosition(selectionElem));
                    openMenu();
                }
            });
        };

        window.addEventListener('keypress', triggerMenu);
        return () => {
            window.removeEventListener('keypress', triggerMenu);
        };
    }, [editor, isShowingMenu, setTopPosition, openMenu]);

    // close the menu when Escape is pressed
    React.useEffect(() => {
        if (!isShowingMenu) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeMenu({resetCursor: true});
                return;
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isShowingMenu, closeMenu]);

    // close the menu on clicks outside the menu
    React.useEffect(() => {
        if (!isShowingMenu) {
            return;
        }

        const handleMousedown = (event) => {
            if (containerRef.current?.contains(event.target)) {
                return;
            }

            closeMenu();
        };

        window.addEventListener('mousedown', handleMousedown);
        return () => {
            window.removeEventListener('mousedown', handleMousedown);
        };
    }, [isShowingMenu, closeMenu]);

    // capture key navigation to move/insert selected card item
    React.useEffect(() => {
        if (!isShowingMenu) {
            return;
        }

        const moveUp = (event) => {
            if (selectedItemIndex === 0) {
                setSelectedItemIndex(cardMenu.maxItemIndex);
            } else {
                setSelectedItemIndex(selectedItemIndex - 1);
            }

            event.preventDefault();
            return true;
        };

        const moveDown = (event) => {
            if (selectedItemIndex === cardMenu.maxItemIndex) {
                setSelectedItemIndex(0);
            } else {
                setSelectedItemIndex(selectedItemIndex + 1);
            }

            event.preventDefault();
            return true;
        };

        const enter = (event) => {
            document.querySelector(`[data-kg-slash-menu] [data-kg-cardmenu-idx="${selectedItemIndex}"]`)?.click();
            event.preventDefault();
            return true;
        };

        return mergeRegister(
            editor.registerCommand(
                KEY_ARROW_DOWN_COMMAND,
                moveDown,
                COMMAND_PRIORITY_HIGH
            ),
            editor.registerCommand(
                KEY_ARROW_UP_COMMAND,
                moveUp,
                COMMAND_PRIORITY_HIGH
            ),
            editor.registerCommand(
                KEY_ARROW_RIGHT_COMMAND,
                moveDown,
                COMMAND_PRIORITY_HIGH
            ),
            editor.registerCommand(
                KEY_ARROW_LEFT_COMMAND,
                moveUp,
                COMMAND_PRIORITY_HIGH
            ),
            editor.registerCommand(
                KEY_ENTER_COMMAND,
                enter,
                COMMAND_PRIORITY_HIGH
            )
        );
    }, [editor, isShowingMenu, cardMenu, selectedItemIndex]);

    // build up the card menu based on registered nodes and current search
    React.useEffect(() => {
        const cardNodes = getEditorCardNodes(editor);
        setCardMenu(buildCardMenu(cardNodes, {insert, query}));
        setSelectedItemIndex(0);
    }, [editor, query, insert, setCardMenu, setSelectedItemIndex]);

    if (cardMenu.menu?.size === 0) {
        return null;
    }

    if (isShowingMenu) {
        return (
            <div className="absolute -left-2 mt-2" style={{top: `${topPosition}px`}} ref={containerRef} data-kg-slash-container>
                <SlashMenu>
                    <CardMenu menu={cardMenu.menu} selectedItemIndex={selectedItemIndex} insert={insert} />
                </SlashMenu>
            </div>
        );
    }

    return null;
}

export default function SlashCardMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    return useSlashCardMenu(editor);
}
