import { videojs, Component } from "./videoComponent";

const ControlButton = videojs.extend(Component, {
    constructor(player, options) {
        /* initialize your button */
        this.createButton(player, options);
    },
    createButton(player) {
        // 加入客製化 Button 

        let buttons = videojs.dom.createEl("div", {
            className: "vjs-control-buttons",
            innerHTML: `
            <button class="vjs-control vjs-button" id="prev-sec-btn">
                <span class="vjs-icon-placeholder mdi mdi-rewind-10" aria-hidden="true" aria-label="prevSec" title="後退 10秒"></span>
            </button>
            <button class="vjs-control vjs-button" id="next-sec-btn">
                <span class="vjs-icon-placeholder mdi mdi-fast-forward-10" aria-hidden="true" aria-label="nextSec" title="前進10秒"></span>
            </button>

            `
            // <button class="vjs-control vjs-button" id="note">
            // <span class="vjs-icon-placeholder mdi mdi-pen-plus" aria-hidden="true" aria-label="note" title="新增筆記"></span>
            // </button>
        });
        let controlBar = player.getChild('controlBar').el();
         let insertBeforeNode = controlBar.children[5];
        controlBar.insertBefore(buttons, insertBeforeNode);
        // 插入空白 
        player.getChild('controlBar').addChild('CustomControlSpacer',{},5);
    }
});

ControlButton.prototype.controlText_ = 'controlButton';
Component.registerComponent('ControlButton', ControlButton);
export default ControlButton;