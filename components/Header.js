import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/spotify">
      <a style={linkStyle}>Log in</a>
    </Link>
  </div>
);

export default Header;
