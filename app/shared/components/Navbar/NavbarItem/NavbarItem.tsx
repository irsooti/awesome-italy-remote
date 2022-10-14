import { NavLink } from '@remix-run/react';
import { type ComponentProps } from 'react';

type NavbarItemProps = ComponentProps<typeof NavLink> & {
  children: React.ReactNode;
};

const NavbarItem = (props: NavbarItemProps) => {
  return (
    <NavLink {...props}>
      {({ isActive }) =>
        isActive ? <strong>{props.children}</strong> : props.children
      }
    </NavLink>
  );
};

export default NavbarItem;
