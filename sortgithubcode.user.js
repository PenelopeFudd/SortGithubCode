// ==UserScript==
// @name         Sort Github Code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add headers to github file listings that allow sorting
// @author       sort-github-code@ch.pkts.ca
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @require      https://code.jquery.com/jquery-3.6.0.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.debug("Sort github code starts");
    // alert("Sort github code starts");
    var container = $("div.Details-content--hidden-not-important:nth-child(1):nth-child(1)");

    var type_sort = $('<button/>', {
        type: 'button',
        text: 'Type',
        title: 'Sort by Type',
        click: function () { sortFiles("type"); }
    }).addClass('btn').insertBefore(container);

    var name_sort = $('<button/>', {
        type: 'button',
        text: 'Name',
        title: 'Sort by Name',
        click: function () { sortFiles("name"); }
    }).addClass('btn').insertBefore(container);

    var commit_sort = $('<button/>', {
        type: 'button',
        text: 'Commit Message',
        title: 'Sort by Commit Message',
        click: function () { sortFiles("commit"); }
    }).addClass('btn').insertBefore(container);

    var age_sort = $('<button/>', {
        type: 'button',
        text: 'Age',
        title: 'Sort by Age',
        click: function () { sortFiles("age"); }
    }).addClass('btn').insertBefore(container);

    function find_name(item) { return $(item).children().eq(1).children().text(); }
    function find_date(item) { return $(item).children().eq(3).children().eq(0).attr("datetime"); }
    function find_commit(item) { return $(item).children().eq(2).children().text().trim(); }
    function find_type(item) { return $(item).children().eq(0).children().attr("aria-label"); }

    function sortFiles(sortby) {
        var files = container.children().slice(1);

        var order = localStorage.getItem('GithubSort') || "none";
        var new_order = sortby;
        if (order == sortby) {new_order = "rev-"+sortby; }
        if (order == "rev-"+sortby) { new_order = sortby; }
        localStorage.setItem("GithubSort", new_order);

        files.sort(function(a, b) {
            if ( new_order == "type"   ) {return   find_type(a).localeCompare(find_type(b)); }
            if ( new_order == "name"   ) {return   find_name(a).localeCompare(find_name(b)); }
            if ( new_order == "commit" ) {return   find_commit(a).localeCompare(find_commit(b)); }
            if ( new_order == "age"    ) {return   find_date(b).localeCompare(find_date(a)); }

            if ( new_order == "rev-type"   ) {return -  find_type(a).localeCompare(find_type(b)); }
            if ( new_order == "rev-name"   ) {return -  find_name(a).localeCompare(find_name(b)); }
            if ( new_order == "rev-commit" ) {return -  find_commit(a).localeCompare(find_commit(b)); }
            if ( new_order == "rev-age"    ) {return -  find_date(b).localeCompare(find_date(a)); }
            return (find_date(b) - find_date(a)); // sortby == "date", or other
        }).each( function(index, item) {container.append($(item));} );
    };

})();
