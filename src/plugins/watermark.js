import { videojs, Component } from "./videoComponent";

const BigPlayButton = videojs.getComponent('BigPlayButton');

const Watermark = videojs.extend(BigPlayButton, {
    constructor(player, options) {
        BigPlayButton.apply(this, arguments);

        if (options.content) {
            this.updateContent(options.content);
        }

    },
    createEl() {
        const props = {
            className: 'vjs-wartermark-content',
            // tabIndex: 0
        };
        return videojs.dom.createEl('div', props);
    },
    updateContent(content) {
        let contentEl;
        if (Object.keys(content).length > 0) {
            Object.keys(content).forEach(el => {
                contentEl = videojs.dom.createEl('div', {
                    className: "vjs-wartermark-" + el,
                    innerHTML: content[el]
                });
                videojs.dom.appendContent(this.el(), contentEl);
            })
        } else {
            contentEl = videojs.dom.createEl('div', {
                className: "vjs-wartermark-" + Object.keys(content)[0],
                innerHTML: content[Object.keys(content)[0]]
            });
            videojs.dom.insertContent(this.el(), contentEl);
        }
    },
    handleClick(event) { 
        event.stopPropagation();
    }
});

Watermark.prototype.controlText_ = 'watermark';
Component.registerComponent('Watermark', Watermark);
export default Watermark;