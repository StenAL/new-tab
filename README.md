# new-tab
```
A custom new-tab page made in React.
```
Minimalistic, cool, lightweight. Customizable and extendable. Integrated with the
TransferWise API to show your current borderless account balance.

![example](https://user-images.githubusercontent.com/21343173/79687620-7e7f2100-8240-11ea-8d7a-1824d81dc4ee.png)

## How to use
1. Clone the git repository `git clone https://github.com/StenAL/favicon-marquee.git`
2. Install necessary dependencies using npm `npm i`
3. [Generate a TransferWise API token](https://transferwise.com/help/19/transferwise-for-business/2958229/whats-a-personal-api-token-and-how-do-i-get-one)
4. Create a `.env` file at the root directory of your project and specify your
 token in it `REACT_APP_TRANSFERWISE_API_TOKEN=token-goes-here`. This token
 is only used for API calls and is never stored anywhere except your `.env` and `build` files
5. Build the final static resources `npm run build`

Your new-tab page is now ready. It is available at `build/index.html`

Depending on your browser you now need to either manually redirect your new-tab page
or use an extension to do it ([Chrome](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna))

## License
This project is licensed under the [MIT license](https://github.com/StenAL/new-tab/blob/master/LICENSE)