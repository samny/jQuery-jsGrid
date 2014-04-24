# jQuery jsGrid - equal heights

Makes elements in container equal height, taking into account the row distribution of floated elements".


## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/samny/jQuery-jsGrid/master/dist/jquery.jsgrid.min.js
[max]: https://raw.github.com/samny/jQuery-jsGrid/master/dist/jquery.jsgrid.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jsgrid.min.js"></script>
<script>
jQuery(function($) {
  $('[data-js-grid]').jsGrid({
    sel_content: '[data-js-grid-item]',
    sel_exclude: '.fixed-ratio',
    throttleDelay: 100
  });
});
</script>
```

## Documentation

See demo for options

TODO: write some tests

## Examples

See demo

## Release History
_(Nothing yet)_
