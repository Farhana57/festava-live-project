// Sticky Plugin v1.0.4 for jQuery
(function($) {
    var defaults = {
        topSpacing: 0,
        bottomSpacing: 0,
        className: 'is-sticky',
        wrapperClassName: 'sticky-wrapper',
        center: false,
        getWidthFrom: '',
        responsiveWidth: false
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
        var scrollTop = $window.scrollTop(),
            documentHeight = $document.height(),
            dvh = documentHeight - windowHeight,
            extra = (scrollTop > dvh) ? dvh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {
            var s = sticked[i],
                elementTop = s.stickyWrapper.offset().top,
                etse = elementTop - s.topSpacing - extra;

            if (scrollTop <= etse) {
                if (s.currentTop !== null) {
                    s.stickyElement.css('position', '').css('top', '');
                    s.stickyElement.parent().removeClass(s.className);
                    s.currentTop = null;
                }
            } else {
                var newTop = documentHeight - s.stickyElement.outerHeight() - s.topSpacing - s.bottomSpacing - scrollTop - extra;
                if (newTop < 0) {
                    newTop = newTop + s.topSpacing;
                } else {
                    newTop = s.topSpacing;
                }
                if (s.currentTop != newTop) {
                    s.stickyElement.css('position', 'fixed').css('top', newTop);
                    s.stickyElement.parent().addClass(s.className);
                    s.currentTop = newTop;
                }
            }
        }
    };

    $.fn.sticky = function(method) {
        return this.each(function() {
            var self = $(this),
                stickyId = self.attr('id'),
                wrapper = $('<div></div>').addClass(defaults.wrapperClassName);
            self.wrapAll(wrapper);
            var stickyWrapper = self.parent();
            sticked.push({
                topSpacing: defaults.topSpacing,
                bottomSpacing: defaults.bottomSpacing,
                stickyElement: self,
                currentTop: null,
                stickyWrapper: stickyWrapper,
                className: defaults.className
            });
        });
    };

    $(function() {
        setTimeout(scroller, 0);
        $window.on('scroll', scroller);
    });
})(jQuery);