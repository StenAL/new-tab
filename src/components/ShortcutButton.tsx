import { FunctionComponent } from "react";

interface ShortcutButtonProps {
    name: string;
    url: string;
}

export const ShortcutButton: FunctionComponent<ShortcutButtonProps> = ({ name, url }) => {
    return (
        <a
            className={"shortcut-button"}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/${name}.jpg)`,
            }}
            href={url}
            target={"_self"}
        >
            {" "}
            <span style={{ display: "none" }}>{name}</span>
        </a>
    );
};
