# new-tab

```
A custom new-tab page.
```

Minimalistic, cool, lightweight. Integrated with the
TransferWise API to show your current borderless account balance.

![example](https://user-images.githubusercontent.com/21343173/93712115-7c045880-fb4b-11ea-9471-b0832309251c.png)

## How to use

1. Clone the git repository `git clone https://github.com/StenAL/favicon-marquee.git`
2. Install dependencies using npm `npm i`
3. [Generate a TransferWise API token](https://transferwise.com/help/19/transferwise-for-business/2958229/whats-a-personal-api-token-and-how-do-i-get-one)
4. Create a `.env` file at the root directory of your project and specify your
   token in it `REACT_APP_TRANSFERWISE_API_TOKEN=token-goes-here`. This token
   is only used for API calls and is never stored anywhere except your `.env` and `build` files
5. Build the final static resources `npm run build`

Your new-tab page is now ready. It is available at `build/index.html`

Depending on your browser you now need to either manually redirect your new-tab page ([Firefox](https://reddit.com/r/firefox/comments/ge86z4/newtab_page_to_local_file_firefox_76_redux/fqpyahl/))
or use an extension to do it ([Chrome](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)).

## License

This project is licensed under the [MIT license](https://github.com/StenAL/new-tab/blob/master/LICENSE)
