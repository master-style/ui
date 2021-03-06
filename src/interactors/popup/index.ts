import { Element, Attr } from '@master/element';
import { createPopper, Placement } from '@popperjs/core';
import { isInteractOutside } from '../../utils/is-interact-outside';
import { Template } from '@master/template';

declare const ResizeObserver: any;

import css from './popup.scss';
import { ContentElement } from '../../layout/content';
import { $ } from '@master/dom';
import { TargetElement } from '../../shared/target';

const $body = $(document.body);
const NAME = 'popup';


@Element('m-' + NAME)
export class PopupElement extends TargetElement {
    static css = css;
    /**
     * default
     */
    _fade = true;
    _duration = 300;

    content: ContentElement;
    trigger: HTMLElement;
    popper;
    #resizeObserver;

    @Attr({ reflect: false })
    offset = 0;

    @Attr({ reflect: false })
    distance = 8;

    @Attr({ reflect: false })
    boundaryPadding = 10;

    @Attr({ reflect: false })
    placement: Placement = 'bottom';

    @Attr({ reflect: false })
    closeOn = 'click:outside';

    @Attr({ reflect: false })
    minWidth: string;

    activeChildPopups = new Set;

    // arrow: SVGElement;

    contentTokens: any = () => [];

    template = new Template(() => [
        'm-content', {
            'scroll-y': true,
            guide: true,
            part: 'content',
            $created: (element: ContentElement) => this.content = element
        }, [
            'slot', {
                $created: (element) => element.on('slotchange', (event) => {
                    const onSlotChange = this['onSlotChange'];
                    if (onSlotChange) {
                        onSlotChange.call(this, event);
                    }
                })
            },
            ...this.contentTokens(),
            // 'div', {
            //     slot: 'part',
            //     part: 'arrow',
            //     $created: (element: SVGAElement) => this.arrow = element
            // }, [
            //     'svg', {
            //         part: 'arrow-icon',
            //         height: 10,
            //         viewBox: '0 0 64 20',
            //         $namespace: 'http://www.w3.org/2000/svg',
            //         $html: '<g transform="matrix(1.04009,0,0,1.45139,-1.26297,-65.9145)"><path d="M1.214,59.185C1.214,59.185 12.868,59.992 21.5,51.55C29.887,43.347 33.898,43.308 42.5,51.55C51.352,60.031 62.747,59.185 62.747,59.185L1.214,59.185Z"></path></g>'
            //     }
            // ]
        ]
    ]);

    protected handleTrigger(event, whether) {
        if (!whether) {
            if (
                !isInteractOutside(this.trigger, event) ||
                !isInteractOutside(this.content, event, this.distance)
            ) {
                return false;
            }
        }
    }

    private determineClose = (event: any) => {
        if (this.animation || this.activeChildPopups.size) {
            return;
        }
        if (
            isInteractOutside(this.trigger, event) &&
            isInteractOutside(this.content, event, this.distance)
        ) {
            this.close();
        }
    }

    updateSize() {
        const refRect = this.trigger.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const bottomDistance = windowHeight - (refRect.y + refRect.height);
        const topDistance = refRect.y;
        this.css('maxHeight', (topDistance < bottomDistance ? bottomDistance : topDistance) - this.distance - 10);
        if (this.minWidth === 'trigger') {
            this.css('minWidth', refRect.width);
        }
    }

    async onOpen() {
        const activate = (parent: PopupElement) => {
            if (!parent) {
                return;
            }
            if (parent.tagName === 'M-POPUP') {
                parent.activeChildPopups.add(this);
            } else if (parent !== $body) {
                activate(parent.parentNode as PopupElement);
            }
        };

        activate(this.trigger.parentNode as PopupElement);

        this.updateSize();

        if (!this.popper) {
            await new Promise((resolve) => {
                this.popper = createPopper(this.trigger, this, {
                    placement: this.placement,
                    modifiers: [
                        // {
                        //     name: 'arrow',
                        //     options: {
                        //         element: this.arrow,
                        //     },
                        // },
                        {
                            name: 'offset',
                            options: {
                                offset: [this.offset, this.distance],
                            },
                        },
                        {
                            name: 'flip',
                            options: {
                                flipVariations: false,
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                padding: this.boundaryPadding,
                            }
                        }
                    ],
                    onFirstUpdate: resolve
                });
            });
        }
    }

    onOpened() {
        if (this.popper) {
            if (this.closeOn && this.closeOn.indexOf('mouseout') !== -1) {
                $body
                    .on('mousemove', this.determineClose, { passive: true });
            }

            if (this.closeOn && this.closeOn.indexOf('click:outside') !== -1) {
                $body
                    .on('click', this.determineClose, { passive: true });
            }

            if (!this.#resizeObserver) {
                this.#resizeObserver = new ResizeObserver(() => {
                    this.updateSize();
                    this.popper.update();
                });
                this.#resizeObserver.observe(this.content);
                this.#resizeObserver.observe(this.trigger);
            }
        }
    }

    onClose() {
        const deactivate = (parent: PopupElement) => {
            if (!parent) {
                return;
            }
            if (parent.tagName === 'M-POPUP') {
                parent.activeChildPopups.delete(this);
            } else if (parent !== $body) {
                deactivate(parent.parentNode as PopupElement);
            }
        };

        deactivate(this.trigger.parentNode as PopupElement);

        if (this.#resizeObserver) {
            this.#resizeObserver.unobserve(this.content);
            this.#resizeObserver.unobserve(this.trigger);
            this.#resizeObserver = null;
        }
    }

    onClosed() {
        if (this.popper) {
            this.popper = this.popper.destroy();
            $($body).off(this.determineClose);
        }
    }

    protected toggling(
        options: KeyframeEffectOptions
    ) {
        let keyframes: any;

        let scale = '';
        let translate = '';
        let transformOrigin = '';

        switch (this.popper.state.placement.split('-')[0]) {
            case 'top':
                scale = 'Y(.9)';
                transformOrigin = 'center bottom';
                break;
            case 'bottom':
                scale = 'Y(.9)';
                transformOrigin = 'top center';
                break;
            case 'left':
                scale = 'X(.9)';
                transformOrigin = 'right center';
                break;
            case 'right':
                scale = 'X(.9)';
                transformOrigin = 'left center';
                break;
        }

        keyframes = [
            {
                transformOrigin,
                transform: 'scale' + scale,
                opacity: this.fade ? 0 : 1
            },
            {
                transformOrigin,
                transform: 'scaleY(1)',
                opacity: 1
            }
        ];

        if (this.hidden) {
            keyframes.reverse();
        }

        this.animation = this.content.animate(keyframes, options);
        this.animations.push(this.animation);
        return new Promise((finish) => {
            this.animation.onfinish = finish;
        });
    }

    render() {
        this.template.render(this.shadowRoot);
    }
}