###Warning

To run `app.js` you need build a 'local.sh' shell script.

In it, you need define two important environment variables:

* `EJABBERDCTL_BIN`: The absolute path of command `ejabberdclt`

* `EJABBERD_CFG_DIR`: The absolute path of ejabberd configure directory

Remember, you need both permissions to run `EJABBERDCTL_BIN` and to read/write at `EJABBERD_CFG_DIR`.

Otherwise, this module **won't** works for you.
