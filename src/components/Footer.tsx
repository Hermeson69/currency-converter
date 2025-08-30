import { Github, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const links = [
  { href: "https://github.com", icon: Github },
  { href: "https://instagram.com", icon: Instagram },
  { href: "https://linkedin.com", icon: Linkedin },
];

export const Footer = () => {
  return (
    <footer className="border-t backdrop-blur py-12 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:gap-0">
        <p className="text-center text-sm font-sm md:text-left">
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>

        <div className="flex justify-center gap-4 md:justify-start">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-white hover:text-gray-400 transition duration-300 ease-in-out"
            >
              <link.icon size={20} />
            </Link>
          ))}
        </div>
        <Link
          to="/privacy-policy"
          className="text-center text-sm hover:underline md:text-right"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};
