import PropTypes from "prop-types";
import { testLinks } from "./__tests__/testLinks";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useFunction } from "~/misc/functions";

function Sidebar() {
  return (
    <section className="sticky top-0 left-0 p-2 pt-1 min-w-[250px] h-fit rounded-md bg-default-100">
      <SidebarItems />
    </section>
  );
}

function SidebarItems() {
  const { toSpaced } = useFunction();
  const location = useLocation();
  return (
    <div className="flex flex-col gap-2">
      {Object.keys(testLinks).map((head) => {
        return (
          <>
            <p className="uppercase text-sm font-bold text-main-300">
              {toSpaced(head)}
            </p>
            {testLinks[head].map((item) => (
              <SidebarItem
                key={item.title}
                {...item}
                isActive={
                  item.title === "dashboard"
                    ? item.link === "" && location.pathname === "/"
                    : location.pathname.includes(item.link)
                }
              />
            ))}
          </>
        );
      })}
    </div>
  );
}

function SidebarItem({ title, icon: Icon, link, isActive }) {
  return (
    <Link
      to={link}
      className={classNames(
        "flex flex-row items-center gap-2 p-2 transition-all rounded-md select-none ml-2",
        isActive
          ? "text-secondary bg-slate-50 border-l-4 border-secondary-500 pointer-events-none"
          : "text-main-500 hover:bg-default-300"
      )}
    >
      <Icon />
      <span className="capitalize font-semibold">{title}</span>
    </Link>
  );
}

SidebarItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.func,
  link: PropTypes.string,
  isActive: PropTypes.bool,
};

export default Sidebar;
