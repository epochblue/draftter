/**
 * draftter.js
 *
 * @author Bill Israel <bill.israel@gmail.com>
 */
$(function() {
    var $tmpl = $('#draft-template').html(),
        $drafts = $('.drafts'),
        $save = $('.save-drafts'),
        dirty = false;

    // Click handler for adding a draft
    $('.add-draft').on('click', null, function(e) {
        e.preventDefault();
        $drafts.prepend($tmpl.replace('{{ tweet }}', ''));
    });

    // Delegate handler for deleting a draft
    $drafts.on('click', '.delete-draft', function(e) {
        e.preventDefault();

        var draft = $(e.target).parent().parent();
        draft.fadeOut('slow', function() {
            $(this).remove()
            dirty = true;
            $save.removeClass('disabled');
        });

    });

    // Delegate handler for tweeting
    $drafts.on('click', '.tweet', function(e) {
        e.preventDefault();

        var $target = $(e.target),
            text = encodeURIComponent($target.parent().prev('textarea').val()),
            url = $target.attr('href') + '?text=' + text;

        if (typeof window.open !== 'undefined') {
            if(!window.open(url, '', 'width=500,height=500')) {
                window.location = url;
            }
        }
    });

    // If things are dirty, save 'em.
    $drafts.on('keypress', 'textarea', function(e) {
        if (!dirty) {
            dirty = true;
            $save.removeClass('disabled');
        }
    });

    // Gotta save those drafts somehow.
    $save.on('click', null, function(e) {
        e.preventDefault();

        if (dirty) {
            var tweets = [];
            $drafts.find('textarea').each(function(i, elm) {
                tweets.push($(elm).val()); 
            });

            if (typeof window.localStorage !== 'undefined') {
                localStorage.setItem('tweets', JSON.stringify(tweets));
                $save.addClass('disabled');
                dirty = false;
            }
        }
    });


    // When the page loads, try to get draft tweets out of local storage
    if (typeof window.localStorage !== 'undefined') {
        var tweets = JSON.parse(localStorage.getItem('tweets'));

        if (tweets) {
            for (var i = tweets.length; i--; ) {
                var html = $tmpl.replace('{{ tweet }}', tweets[i]);
                $drafts.prepend(html);
            }
        }
    }

    // The save button should be disabled by default
    $save.addClass('disabled');
});
