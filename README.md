# track.js [![Circle CI](https://circleci.com/gh/abcum/track.js.svg?style=svg&circle-token=1c0b91df9591b3ec7f3e74bd545124ba622a3a26)](https://circleci.com/gh/abcum/track.js)

Multi-domain web analytics and behaviour tracking for [itsy.li](https://itsy.li)

### Installing the script

The analytics script is available on our CDN.

```js
<script async src="https://itsy.li/track.js" data-opa="ACCOUNTKEY"></script>
```

### Configuring the script

```js
<script>
    var OP = {
        auto: false, // Should we track automatically?
        find: false, // Should we ask the user for their geo position?
    };
</script>
```