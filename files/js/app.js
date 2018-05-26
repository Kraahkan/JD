// events
(function () {

    // open widget on load
    var widget = document.querySelector('.lw-widget[data-lw-onload]');
    if (widget != null) {
        var openDelay = 0;
        if (widget.dataset.lwOnload.length) {
            openDelay = widget.dataset.lwOnload;
        }
        setTimeout(function () {
            showWidget(widget);
        }, openDelay);
    }

    // open widget on click
    document.addEventListener('click', function (e) {
        if ('lwOnclick' in e.target.dataset) {
            var _widget = document.querySelector(e.target.dataset.lwOnclick);
            showWidget(_widget);
        }
    });

    // open widget on scroll page
    var onscrollTriggers = document.querySelectorAll('[data-lw-onscroll]');
    if (onscrollTriggers.length) {
        window.addEventListener('scroll', function (e) {
            onscrollTriggers.forEach(function (item) {
                if (!item.classList.contains('lw-inited')) {
                    var windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (windowScrollTop + window.innerHeight >= item.offsetTop) {
                        var _widget2 = document.querySelector(item.dataset.lwOnscroll);
                        showWidget(_widget2);
                        item.classList.add('lw-inited');
                    };
                };
            });
        });
    };

    // close widget
    var openFlag = true;
    document.addEventListener('click', function (e) {
        if ('lwClose' in e.target.dataset) {
            if (openFlag) {
                var hideItem = function hideItem(item) {
                    item.classList.remove('lw-visible');
                    item.classList.add('lw-animate-reverse');
                    setTimeout(function () {
                        item.classList.remove('lw-animate-reverse');
                    }, 400);
                };

                var hideWidget = function hideWidget() {
                    setTimeout(function () {
                        _widget3.classList.remove('lw-animate');
                        setTimeout(function () {
                            _widget3.classList.remove('lw-open');
                            openFlag = true;
                        }, 400);
                    }, 400);
                };

                var _widget3 = getParents(e.target, '.lw-widget')[0],
                    overlay = _widget3.querySelector('.lw-overlay'),
                    items = _widget3.querySelectorAll('.lw-item');

                if (e.target.classList.contains('lw-overlay')) {
                    openFlag = false;
                    items.forEach(function (item) {
                        hideItem(item);
                        hideWidget();
                    });
                } else {
                    var visibleItems = _widget3.querySelectorAll('.lw-item.lw-visible'),
                        item = getParents(e.target, '.lw-item')[0],
                        itemHeight = item.offsetHeight;

                    hideItem(item);
                    item.animate([{ height: itemHeight + 'px', marginTop: '20px' }, { height: 0, marginTop: 0 }], {
                        delay: 400,
                        duration: 300,
                        fill: 'forwards'
                    });

                    if (visibleItems.length == 1) {
                        hideWidget();
                    }
                }
            }
        }
    });

    function showWidget(widget) {
        var overlay = widget.querySelector('.lw-overlay'),
            items = widget.querySelectorAll('.lw-item');

        widget.classList.add('lw-open');
        setTimeout(function () {
            widget.classList.add('lw-animate');
        }, 10);

        items.forEach(function (item) {
            item.classList.add('lw-animate');
            setTimeout(function () {
                item.classList.remove('lw-animate');
                item.classList.add('lw-visible');
            }, 400);
        });
    };
})();

// button ripple effect
(function () {
    document.addEventListener('click', function (e) {
        var btn = e.target;
        if ('lwRipple' in btn.dataset) {
            var removeRipple = function removeRipple() {
                ripple.parentNode.removeChild(ripple);
            };

            var offset = e.target.getBoundingClientRect(),
                x = e.clientY - offset.top,
                y = e.clientX - offset.left,
                ripple = document.createElement('span');

            ripple.classList.add('lw-ripple');
            ripple.style = 'top: ' + x + 'px; left: ' + y + 'px; width: ' + btn.offsetWidth * 2.2 + 'px; height: ' + btn.offsetWidth * 2.2 + 'px';

            btn.appendChild(ripple);

            lwCssAnimationIsEnd(ripple, removeRipple);
        }
    });
})();

// 
function lwCssAnimationIsEnd(el, callback) {
    el.addEventListener('webkitAnimationEnd', callback, false);
    el.addEventListener('animationend', callback, false);
    el.addEventListener('oanimationend', callback, false);
}

function lwCssTransitionIsEnd(el, callback) {
    el.addEventListener('webkitTransitionEnd', callback, false);
    el.addEventListener('transitionend', callback, false);
    el.addEventListener('otransitionend', callback, false);
}

/**
 * Get all DOM element up the tree that contain a class, ID, or data attribute
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Array} Null if no match
 */
var getParents = function getParents(elem, selector) {

    var parents = [];
    var firstChar;
    if (selector) {
        firstChar = selector.charAt(0);
    }

    // Get matches
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (selector) {

            // If selector is a class
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    parents.push(elem);
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    parents.push(elem);
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
                    parents.push(elem);
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                parents.push(elem);
            }
        } else {
            parents.push(elem);
        }
    }

    // Return parents if any exist
    if (parents.length === 0) {
        return null;
    } else {
        return parents;
    }
};