# new-tab

```
A custom new-tab page.
```

Minimalistic, cool, lightweight. Integrated with the TransferWise API to show your current borderless account balance.

![example](https://user-images.githubusercontent.com/21343173/93712115-7c045880-fb4b-11ea-9471-b0832309251c.png)

## How to use

**Prerequisites**: you need
to [generate a TransferWise Personal API token](https://api-docs.transferwise.com/payouts#wise-payouts-api-documentation-api-access)
to use this page's integration with TransferWise balances.

### Download a release

Changes are automatically built and pushed to the [GitHub Releases](https://github.com/StenAL/new-tab/releases) page
where you can find ready-to-use artifacts in `.zip` and `.tar.gz` format. To set up the page:

1. Download the artifact in your preferred format (either through GitHub's GUI or using the command line)  
   `curl -L -O "https://github.com/StenAL/new-tab/releases/latest/download/new-tab.tar.gz"`
2. Extract files from the archive (through a GUI like 7zip or using the command line)  
   `tar -xvf new-tab.tar.gz`
3. Set the TransferWise API token to your personal access token instead of the placeholder (either
   open `build/static/js/main.RANDOM-LETTERS-AND-NUMBERS.js`, CTRL+F for "TOKEN-GOES-HERE" and replace it with your
   token or use the command line)  
   `sed -i 's/TOKEN-GOES-HERE/YOUR-ACTUAL-TOKEN/g' build/static/js/main.*.js`
4. The page can now be accessed at `build/index.html`

### Build locally

1. Clone the git repository `git clone https://github.com/StenAL/favicon-marquee.git`
2. Install dependencies using npm `npm i`
3. Create a `.env` file at the root directory of your project and set your API token in
   it: `REACT_APP_TRANSFERWISE_API_TOKEN=token-goes-here`.  
   This token is only used for API calls and is never stored anywhere except your `.env` and `build` files
4. Build the static page `npm run build`

Your `new-tab` is now ready. It is available at `build/index.html`

Depending on your browser you now need to either manually redirect your new-tab
page ([Firefox](https://reddit.com/r/firefox/comments/ge86z4/newtab_page_to_local_file_firefox_76_redux/fqpyahl/))
or use an extension to do
it ([Chrome](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)).

## License

This project is licensed under the [MIT license](https://github.com/StenAL/new-tab/blob/master/LICENSE)
