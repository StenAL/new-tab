import React from "react";
import ShortcutButton from "./ShortcutButton";

export default function ShorcutsContainer() {
    return (
        <div className={"shortcuts-container"}>
            <div className={"shortcuts-row"}>
                <ShortcutButton name={"bbc-news"} url={"https://www.bbc.co.uk/news"}/>
                <ShortcutButton name={"bloomberg"} url={"https://www.bloomberg.com/europe"}/>
                <ShortcutButton name={"delfi"} url={"https://www.delfi.ee/"}/>
                <ShortcutButton name={"github"} url={"https://github.com/"}/>
                <ShortcutButton name={"outlook"} url={"https://outlook.office.com/mail/inbox"}/>
            </div>
            <div className={"shortcuts-row"}>
                <ShortcutButton name={"youtube"} url={"https://www.youtube.com/feed/subscriptions"}/>
                <ShortcutButton name={"reddit"} url={"https://old.reddit.com/"}/>
                <ShortcutButton name={"facebook"} url={"https://www.facebook.com/"}/>
                <ShortcutButton name={"twitter"} url={"https://twitter.com/home"}/>
                <ShortcutButton name={"gmail"} url={"https://mail.google.com/"}/>
            </div>
        </div>
    )
}