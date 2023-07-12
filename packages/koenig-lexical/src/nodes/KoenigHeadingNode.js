import {$applyNodeReplacement} from 'lexical';
import {HeadingNode} from '@lexical/rich-text';

export class KoenigHeadingNode extends HeadingNode {
    __renderVersion = '4.0';

    constructor(tag, key) {
        super(key);
        this.__tag = tag;
        this.__renderVersion = '4.0';
    }

    static getType() {
        return 'koenig-heading';
    }

    static clone(node) {
        return new KoenigHeadingNode(node.__tag, node.__key);
    }

    static importJSON(serializedNode) {
        const node = $createKoenigHeadingNode(serializedNode.tag);
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        node.setRenderVersion(serializedNode.renderVersion);
        return node;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            type: 'koenig-heading',
            renderVersion: this.__renderVersion,
            version: 1
        };
    }

    getRenderVersion() {
        const self = this.getLatest();
        return self.__renderVersion;
    }

    setRenderVersion(version) {
        const writable = this.getWritable();
        writable.__renderVersion = version;
    }
}

export const $createKoenigHeadingNode = (headingTag, renderVersion) => {
    return $applyNodeReplacement(new KoenigHeadingNode(headingTag, renderVersion));
};

export function $isKoenigHeadingNode(node) {
    return node instanceof KoenigHeadingNode;
}
