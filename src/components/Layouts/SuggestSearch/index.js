import classNames from "classnames/bind";
import styles from "./SuggestSearch.module.scss";

const cx = classNames.bind(styles);
const initialImage =
    "https://res.cloudinary.com/dcwekkkez/image/upload/v1656135268/oaf2aq4uxyat9d66ih3r.jpg";

function SuggestSearch({ data, active, action }) {
    return (
        <div className={cx("content")}>
            <div className={cx("title-search")}>Kết quả tìm kiếm</div>
            {data.map((user, index) => {
                return (
                    <div className={cx("item-search")} key={index}>
                        {
                            <>
                                <img
                                    className={cx("image")}
                                    src={
                                        !!user
                                            ? !!user.avatar
                                                ? user.avatar
                                                : initialImage
                                            : initialImage
                                    }
                                />
                                <span className={cx("name", "dev-text-more")}>
                                    {user.name || "Người dùng không tồn tại"}
                                </span>
                            </>
                        }
                    </div>
                );
            })}
        </div>
    );
}

export default SuggestSearch;
