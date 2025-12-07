# Redirect eBay Top Level Domain - User Script
For use with ViolentMonkey/GreaseMonkey.

## Tests

For testing regex I use [regex101](https://regex101.com/).

Regular expression (make sure it matches what's in `script.js`):
```
(?<=ebay).*?(?=\/)
```

Test strings:
```
https://www.ebay.com/
https://www.ebay.com/itm/111222333444
https://www.ebay.ca/
https://www.ebay.ca/itm/111222333444
https://www.ebay.co.uk/
https://www.ebay.co.uk/itm/111222333444
```
