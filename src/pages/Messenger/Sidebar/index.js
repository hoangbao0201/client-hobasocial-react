import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

import {
    iconDeleteInput,
    iconLoading,
    iconSearch,
    iconSolidMore,
} from "~/.public/icon";
import { useContext, useEffect, useRef, useState } from "react";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import moment from "moment";
import "moment/locale/vi";

import { AuthContext } from "~/context/authContext";
import useDebounce from "~/hooks/useDebounce";
import SuggestSearchUserMsg from "./SuggestSearchUserMsg";
import Spinner from "~/components/Layouts/Spinner";
import { MessageContext } from "~/context/message";

const cx = classNames.bind(styles);

const ItemMessage = ({ user, data, sosanh, active, setDataContentMessage }) => {
    // Delete post
    const eventDeleteMessage = async () => {
        if (window.confirm("Bạn có thật sự muốn xóa?")) {
        }
    };

    // console.log("data: ", data?._id)
    // console.log("active: ", sosanh?._id)

    return (
        <div
            className={cx(
                "item-message",
                `${active}`,
                "item-msg-grid"
            )}
        >
            <div className={cx("item__grid-image")} onClick={setDataContentMessage}>
                {data.members.map((people) => {
                    if (people._id === user._id) {
                        return;
                    }

                    return (
                        <img
                            key={people._id}
                            className={cx("avatar-user")}
                            src={
                                people.avatar.url || "images/avatar-default.png"
                            }
                            alt="avatar_message"
                        />
                    );
                })}
            </div>
            <div className={cx("item__grid-content")} onClick={setDataContentMessage}>
                <div className={cx("item__content-title")}>
                    {
                        data.members.map((people) => {
                            if (people._id === user._id) {
                                return;
                            }
    
                            return (
                                <span
                                    className={cx("content-title-text")}
                                    key={people._id}
                                >
                                    {people.name}
                                </span>
                            );
                        }) || "Người dùng Hoba"
                    }

                    <span className={cx("content-title-time-new")}>
                        {moment(
                            data.content[data.content.length - 1].created
                        ).fromNow()}
                    </span>
                </div>
                <div className={cx("item__content-message")}>
                    {data.content[data.content.length - 1].text ||
                        "Không tìm thấy thông tin"}
                </div>
            </div>
            <div className={cx("item__grid-side-action")}>
                <Tippy
                    arrow={false}
                    placement="bottom-end"
                    duration="100"
                    trigger="click"
                    theme="light"
                    appendTo="parent"
                    interactive="true"
                    content={
                        <div className={cx("dropdown")}>
                            <div className={cx("action-more-menu-item")}>
                                Ẩn cuộc trò chuyện
                            </div>
                            <div className={cx("action-more-menu-item")}>
                                Ghim
                            </div>
                            <div
                                className={cx(
                                    "action-more-menu-item",
                                    "menu-item-delete"
                                )}
                                onClick={eventDeleteMessage}
                            >
                                Xóa hội thoại
                            </div>
                        </div>
                    }
                >
                    <span
                        className={cx("side-list-action")}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        {iconSolidMore}
                    </span>
                </Tippy>
            </div>
        </div>
    );
};

function Sidebar({
    user,
    active,
    setDataContentMessage,
    msgLoading,
    allMessages,
    loadingSearchPeople,
    setLoadingSearchPeople,
    eventGetAllMessage,
}) {
    // usecontext
    const { searchUser } = useContext(AuthContext);
    const {
        state: { searchPeopleMesage },
        userMessage,
    } = useContext(MessageContext);

    const [focusInputSearch, setFocusInputSearch] = useState(false);
    const [resultListUserSearch, setResultListUserSearch] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [valueInputSearch, setValueInputSearch] = useState("");
    const inputRef = useRef();

    const textDebounce = useDebounce(valueInputSearch, 500);

    useEffect(() => {
        if (textDebounce === "") {
            setResultListUserSearch([]);
        } else if (textDebounce) {
            eventSearchUser(textDebounce);
        }

        setLoadingSearch(false);
    }, [textDebounce]);

    // Search user
    const eventSearchUser = async (data) => {
        const dataServer = await searchUser(data);
        if (dataServer.success) {
            setResultListUserSearch(dataServer.resultSearch);
        }
    };

    // Handle focus input
    const eventFocusInput = () => {
        inputRef.current.focus();
    };

    // Delete value input
    const eventDeleteValueInput = () => {
        setValueInputSearch("");
        inputRef.current.focus();
    };

    // Onchange value search
    const eventOnchangeValueSearch = async (e) => {
        setLoadingSearch(true);
        setValueInputSearch(e.target.value);
    };

    // Active item message
    const eventActiveItemMessage = async (data) => {
        // console.log(data)
        if (data.content) {
            setDataContentMessage(data);
        } else {
            setLoadingSearchPeople(true);
            const dataServerContentMsg = await userMessage(data._id);
            setLoadingSearchPeople(false);

            if (dataServerContentMsg.messages.length > 0) {
                setDataContentMessage(...dataServerContentMsg.messages);
            } else {
                console.log(123)
                setDataContentMessage({
                    messagesId: null,
                    content: [],
                    members: [data],
                    _id: null,
                });
            }
        }
    };

    // Close suggest search
    const eventCloseSuggestSearch = () => {
        setFocusInputSearch(false);
        setValueInputSearch("");
        eventGetAllMessage();
    };

    let contentSidebar;
    if (!focusInputSearch) {
        if (allMessages.length === 0) {
            contentSidebar = (
                <>
                    <div className={cx("sidebar-msg-null")}>
                        Không có tin nhắn nào !
                    </div>
                </>
            );
        } else {
            contentSidebar = (
                <>
                    {allMessages.map((item) => {
                        return (
                            <ItemMessage
                                user={user}
                                key={item._id}
                                data={item}
                                sosanh={active}
                                active={item?._id === active?._id ? "active" : ""}
                                setDataContentMessage={() => eventActiveItemMessage(item)}
                            />
                        );
                    })}
                </>
            );
        }
    } else {
        contentSidebar = (
            <>
                <SuggestSearchUserMsg
                    user={user}
                    data={resultListUserSearch}
                    isActive={active}
                    eventActiveItemMessage={eventActiveItemMessage}
                />
            </>
        );
    }

    return (
        <div className={cx("wrapper", `${!!active ? "checked" : ""}`)}>
            <div className={cx("side-search")}>
                <div className={cx("grid-input-search")}>
                    <i className={cx("icon-search")} onClick={eventFocusInput}>
                        {iconSearch}
                    </i>
                    <input
                        className={cx("input-search")}
                        placeholder="Tìm kiếm"
                        ref={inputRef}
                        value={valueInputSearch}
                        onChange={eventOnchangeValueSearch}
                        onFocus={() => setFocusInputSearch(true)}
                    />
                    {loadingSearch ? (
                        <i className={cx("icon-loading-input")}>
                            {iconLoading}
                        </i>
                    ) : (
                        !!valueInputSearch && (
                            <i
                                className={cx("icon-delete-input")}
                                onClick={eventDeleteValueInput}
                            >
                                {iconDeleteInput}
                            </i>
                        )
                    )}
                </div>
                {focusInputSearch && (
                    <span
                        className={cx("close-suggest-sidebar")}
                        onClick={eventCloseSuggestSearch}
                    >
                        Đóng
                    </span>
                )}
            </div>

            <div id="myDIV" className={cx("list-user-message")}>
                {contentSidebar}
            </div>
        </div>
    );
}

export default Sidebar;
