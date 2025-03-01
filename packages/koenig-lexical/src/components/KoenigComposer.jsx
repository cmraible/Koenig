import React from 'react';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import DEFAULT_NODES from '../nodes/DefaultNodes';
import defaultTheme from '../themes/default';
import KoenigComposerContext from '../context/KoenigComposerContext';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function defaultOnError(error) {
    console.error(error); // eslint-disable-line
}

const defaultConfig = {
    namespace: 'KoenigEditor',
    theme: defaultTheme
};

const KoenigComposer = ({
    initialEditorState,
    nodes = [...DEFAULT_NODES],
    onError = defaultOnError,
    fileUploadFunction,
    unsplashConfig,
    children
}) => {
    const initialConfig = React.useMemo(() => {
        return Object.assign({}, defaultConfig, {
            nodes,
            editorState: initialEditorState,
            onError
        });
    }, [initialEditorState, nodes, onError]);

    const editorContainerRef = React.useRef(null);

    const fileUploader = fileUploadFunction || function () {
        console.error('requires imageUploadFunction to be passed to KoenigComposer component, eg <KoenigComposer imageUploadFunction={function} />'); // eslint-disable-line no-console
        return;
    };

    const unsplashConf = unsplashConfig || function () {
        console.error('requires unsplashConfig to be passed to KoenigComposer component, eg <KoenigComposer unsplashConfig={config} />'); // eslint-disable-line no-console
        return;
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <KoenigComposerContext.Provider value={{fileUploader, editorContainerRef, unsplashConf}}>
                {children}
            </KoenigComposerContext.Provider>
        </LexicalComposer>
    );
};

export default KoenigComposer;
