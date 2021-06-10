const JadUIPlugins = {}
JadUIPlugins.install = function(Vue) {
    Vue.component('jad-button-group', JadButtonGroup)
    Vue.component('jad-button', JadButton)
    Vue.component('jad-dropdown', JadDropdown)
    Vue.component('jad-dropdown-menu', JadDropdownMenu)
    Vue.component('jad-dropdown-item', JadDropdownItem)
    Vue.component('jad-carousel', JadCarousel)
    Vue.component('jad-carousel-item', JadCarouselItem)
    Vue.component('jad-backtop', JadBacktop)
    Vue.component('jad-toolsbar', JadToolsbar)
    Vue.component('jad-toolsbar-item', JadToolsbarItem)
    Vue.component('jad-toolsbar-icon', JadToolsbarIcon)
    Vue.component('jad-toolsbar-content', JadToolsbarContent)
}
let JadButtonGroup = {
    template: 
    '<div class="jad-button-group">' +
        '<slot/>' +
    '</div>'
}
let JadButton = {
    template: 
    '<button :disabled="disabled" :type="nativeType" :class="[&#39;jad-button&#39;, typeClass, plainClass, roundClass, circleClass, disabledClass]">' +
        '<slot/>' +
    '</button>',
    props: {
        nativeType: { type: String, default: 'button' },
        type: String,
        plain: Boolean,
        round: Boolean,
        circle: Boolean,
        disabled: Boolean
    },
    computed: {
        typeClass: function() {
            return this.type ? 'jad-button-' + this.type : 'jad-button-default'
        },
        plainClass: function() {
            return this.plain && 'is-plain'
        },
        roundClass: function() {
            return this.round && 'is-round'
        },
        circleClass: function() {
            return this.circle && 'is-circle'
        },
        disabledClass: function() {
            return this.disabled && 'is-disabled'
        }
    }
}
let JadDropdown= {
    template:
    '<div class="jad-dropdown" @mouseenter="trigger(true)" @mouseleave="trigger(false)">' +
        '<slot/>' +
    '</div>',
    props: {
        placementH: { type: String, default: 'left' },
        placementV: { type: String, default: 'top' }
    },
    data: function() {
        return {
            visible: false
        }
    },
    methods: {
        trigger: function(boolean) {
            this.visible = boolean
        }
    }
}
let JadDropdownMenu = {
    template:
    '<transition name="jad-dropdown-menu">' +
    '<div class="jad-dropdown-menu" :style="style" v-if="visible">' +
        '<dl class="jad-dropdown-list">' +
            '<slot/>' +
        '</dl>' +
    '</div>' +
    '</transition>',
    computed: {
        visible: function() {
            return this.$parent.visible
        },
        style: function() {
            let styleMap = { 'left': 'left: 0px;', 'right': 'right: 0px;', 'top': 'top: ' + this.$parent.$el.clientHeight + 'px;', 'bottom': 'bottom: ' + this.$parent.$el.clientHeight + 'px;'}
            let origin = this.$parent.placementV == 'bottom' ? 'transform-origin: center bottom;' : 'transform-origin: center top;'
            return styleMap[this.$parent.placementH] + ' ' + styleMap[this.$parent.placementV] + ' ' + origin
        }
    }
}
let JadDropdownItem = {
    template:
    '<dd class="jad-dropdown-item">' +
        '<slot/>' +
    '</dd>'
}
let JadCarousel = {
    template: 
    '<div class="jad-carousel">' +
        '<div class="jad-carousel-container" @touchstart="touches($event)">' +
            '<div class="jad-carousel-list" :style="&#39;transform: translate(&#39; + translate[0] + &#39;px,&#39; + translate[1] + &#39;px); transition: &#39; + transition + &#39;;&#39;">' +
                '<slot v-for="item in slot" />' +
            '</div>' +
        '</div>' +
        '<div :class="[&#39;jad-carousel-arrow&#39;, &#39;jad-carousel-arrow-left&#39;, arrowClass]" @click="turn(&#39;prev&#39;)">&#xf104;</div>' +
        '<div :class="[&#39;jad-carousel-arrow&#39;, &#39;jad-carousel-arrow-right&#39;, arrowClass]" @click="turn(&#39;next&#39;)">&#xf105;</div>' +
        '<div :class="[&#39;jad-carousel-indicators&#39;, indicatorPositionClass]">' +
            '<em v-for="item in num" :key="item" :class="{ &#39;is-active&#39; : item - 1 == index }" @click="indicators(item - 1)"></em>' +
        '</div>' +
    '</div>',
    data: function() {
        return {
            slot: 1,
            num: 0,
            index: 0,
            active: false,
            translate: [0, 0],
            transition: 'all 0s',
            touch: [0, 0, 0]
        }
    },
    props: {
        autoplay: Boolean,
        interval: { type: Number, default: 3000 },
        indicatorPosition: String,
        arrow: { type: String, default: 'hover' }
    },
    methods: {
        init: function() {
            this.num = this.$children.length
            if(this.num * this.$children[0].$el.clientWidth > this.$children[0].$el.parentNode.clientWidth) {
                this.slot = 3
                this.translate[0] = this.num * -this.$children[0].$el.clientWidth
                this.autoplay && this.autorun()
            }
        },
        turn: function(o) {
            if(this.num * this.$children[0].$el.clientWidth > this.$children[0].$el.parentNode.clientWidth) {
                this.transition = 'all 0.5s'
                if(!this.active) {
                    this.active = true
                    if(o == 'prev') {
                        this.index --
                        this.translate[0] = this.index * -this.$children[0].$el.clientWidth + (this.num * -this.$children[0].$el.clientWidth)
                        if(this.index + 1 < 1) {
                            this.index = this.num - 1
                            let _this = this
                            setTimeout(function() {
                                _this.transition = 'all 0s'
                                _this.translate[0] = (_this.num * 2 - 1) * -_this.$children[0].$el.clientWidth
                                _this.active = false
                            }, 500)
                        }
                    }
                    if(o == 'next') {
                        this.index ++
                        this.translate[0] = this.index * -this.$children[0].$el.clientWidth + (this.num * -this.$children[0].$el.clientWidth)
                        if(this.index + 1 > this.num) {
                            this.index = 0
                            let _this = this
                            setTimeout(function() {
                                _this.transition = 'all 0s'
                                _this.translate[0] = _this.num * -_this.$children[0].$el.clientWidth
                                _this.active = false
                            }, 500)
                        }
                    }
                }
                let _this = this
                this.$el.children[0].children[0].addEventListener('transitionend', function() {
                    _this.active = false
                })
            }
        },
        indicators: function(i) {
            this.index = i
            this.transition = 'all 0.5s'
            this.translate[0] = this.index * -this.$children[0].$el.clientWidth + (this.num * -this.$children[0].$el.clientWidth)
        },
        touches: function(e) {
            if(!this.active) {
                this.transition = 'all 0s'
                this.touch[0] = e.changedTouches[0].clientX
                let x = this.translate[0]
                let _this = this
                document.ontouchmove = function(_e) {
                    _this.touch[1] = _e.changedTouches[0].clientX - _this.touch[0] + x
                    _this.$set(_this.translate, 0, _this.touch[1])
                }
                document.ontouchend = function(_e) {
                    _this.touch[2] = _e.changedTouches[0].clientX
                    let precent = parseInt((_this.touch[2] - _this.touch[0]) / _this.$el.clientWidth * 100)
                    if (precent >= 15) {
                        _this.turn('prev')
                    } else if(precent <= -15) {
                        _this.turn('next')
                    } else {
                        _this.active = true
                        _this.transition = 'all 0.5s'
                        _this.$set(_this.translate, 0, _this.index * -_this.$children[0].$el.clientWidth + (_this.num * -_this.$children[0].$el.clientWidth))
                        let __this = _this
                        _this.$el.children[0].children[0].addEventListener('transitionend', function() {
                            __this.active = false
                        })
                    }
                    _this.touch = [0, 0, 0]
                    document.ontouchmove = document.ontouchend = null
                }
            }
        },
        autorun: function() {
            let _this = this
            let autorun = setInterval(function() {
                _this.turn('next')
            }, _this.interval)
            this.$el.addEventListener('mouseenter', function() {
                clearInterval(autorun)
            })
            this.$el.addEventListener('mouseleave', function() {
                let __this = _this
                autorun = setInterval(function() {
                    __this.turn('next')
                }, __this.interval)
            })
        }
    },
    computed: {
        indicatorPositionClass: function() {
            return this.indicatorPosition != null && 'jad-carousel-indicators-' + this.indicatorPosition
        },
        arrowClass: function() {
            return this.arrow != null && 'jad-carousel-arrow-' + this.arrow
        }
    },
    mounted: function() {
        this.init()
    }
}
let JadCarouselItem = {
    template: 
    '<div class="jad-carousel-item">'+
        '<slot/>'+ 
    '</div>'
}
let JadBacktop = {
    template: 
    '<transition name="jad-backtop">' +
    '<div :class="[&#39;jad-backtop&#39;, visible]" :style="&#39;right: &#39; + right + &#39;px; bottom: &#39; + bottom + &#39;px;&#39;" @click="backtop()" v-if="visible">' +
        '<slot v-if="$slots.default"/>' +
        '<i class="jad-icon" v-else>&#xf0d8;</i>' +
    '</div>' +
    '</transition>',
    props: {
        right: { type: Number, default: 40 },
        bottom: { type: Number, default: 40 },
        target: { type: String, default: 'window' },
        visibilityHeight: { type: Number, default: 100 }
    },
    data: function() {
        return {
            visible: false
        }
    },
    methods: {
        backtop: function() {
            let obj
            this.target == 'window' ? obj = 'html' : obj = this.target
            let boost = 0
            let _this = this
            let scroll = setInterval(function() {
                boost += 5
                document.querySelector(obj).scrollTop = document.querySelector(obj).scrollTop - boost
                if(document.querySelector(obj).scrollTop <= 0) {
                    document.querySelector(obj).scrollTop = 0
                    clearInterval(scroll)
                }
            }, 10)
        },
        visibles: function() {
            let _this = this
            if(this.target == 'window') {
                window.addEventListener('scroll', function(e) {
                    e.currentTarget.scrollY >= _this.visibilityHeight || e.currentTarget.pageYOffset >= _this.visibilityHeight ? _this.visible = true : _this.visible = false
                })
            } else {
                document.querySelector(this.target).addEventListener('scroll', function(e) {
                    e.currentTarget.scrollTop >= _this.visibilityHeight || e.currentTarget.pageYOffset >= _this.visibilityHeight ? _this.visible = true : _this.visible = false
                })
            }
        }
    },
    mounted: function() {
        this.visibles()
    }
}
let JadToolsbar = {
    template:
    '<div class="jad-toolsbar" :style="&#39;right: &#39; + right + &#39;px;&#39;">' +
        '<dl class="jad-toolsbar-list">' +
            '<slot/>' +
        '</dl>' +
    '</div>',
    props: {
        right: { type: Number, default: 5 }
    }
}
let JadToolsbarItem = {
    template:
    '<dd class="jad-toolsbar-item">' +
        '<slot/>' +
    '</dd>',
    data: function() {
        return {
            visible: false
        }
    },
    methods: {
        visibles: function() {
            let _this = this
            this.$el.addEventListener('mouseenter', function() {
                _this.visible = true
            })
            this.$el.addEventListener('mouseleave', function() {
                _this.visible = false
            })
        }
    },
    mounted: function() {
        this.visibles()
    }
}
let JadToolsbarIcon = {
    template:
    '<div class="jad-toolsbar-icon">' +
        '<slot/>' +
    '</div>'
}
let JadToolsbarContent = {
    template:
    '<transition name="jad-toolsbar-content">' +
    '<div class="jad-toolsbar-content" :style="&#39;right: &#39; + right + &#39;px;&#39;" v-if="visible">' +
        '<slot/>' +
    '</div>'+
    '</transition>',
    computed: {
        visible: function() {
            return this.$parent.visible
        },
        right: function() {
            return this.$parent.$el.clientWidth + 10
        }
    }
}