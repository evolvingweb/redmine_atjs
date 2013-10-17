# redmine-atjs

Started working on integrating redmine 1.2 and at.js library, to support issue autocompletion.
![](http://dl-web.dropbox.com/u/29440342/screenshots/HRJHOZ-2013.10.17-19.48.png)

For initial dev purposes, available as a bookmarklet. 

To start developing on this, do the following:

```
git clone https://github.com/dergachev/redmine-atjs.git
cd redmine-atjs

# do this in a separate tab
python tools/simple_http_server.py
```

Then visit https://localhost:4443 and install the bookmarklet.
Then test it by activating on an issue page.

## TODO

* this pulls in jquery 1.7, needs to call jQuery.noConflict() or breaks prototype
* see if its possible to allow multiword searches
* figure out how to get redmine 1.2 to sort in descending ID order
* create into redmine plugin, test with redmine 2.3 (this was written for 1.2)
