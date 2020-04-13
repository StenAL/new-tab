import React from "react";
export default function ShortcutButton({name, url}) {

    return (
    <a className={"shortcut-button"} style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${name}.jpg)`}}
    href={url} target={"_self"}>
    </a>)
}