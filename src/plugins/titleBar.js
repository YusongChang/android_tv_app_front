import {videojs, Component} from "./videoComponent";

class TitleBar extends Component {

    constructor(player, options) {
        super(player, options);
        if (options.text) {
            this.updateTextContent(options.text);
        }
    }

    createEl() {
        return super.createEl('div', {
            className: "vjs-title-bar"
        });
    }
    /**
     * 设置标题
     * @param {String} text the title
     */
    updateTextContent(text) {
        // 如果options中没有提供text属性，默认显示为空
        if (typeof text !== 'string') {
            text = '';
        }
        videojs.dom.emptyEl(this.el());
        videojs.dom.appendContent(this.el(), text);
    }
}

TitleBar.prototype.controlText_ = 'title-bar';
Component.registerComponent('TitleBar', TitleBar);
export default TitleBar;