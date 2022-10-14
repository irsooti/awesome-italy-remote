import NavbarItem from './NavbarItem';

function Navbar() {
  return (
    <nav>
      <NavbarItem to="/companies">companies</NavbarItem>
      <NavbarItem to="/about">about</NavbarItem>
    </nav>
  );
}

export default Navbar;
