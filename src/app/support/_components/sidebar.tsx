import { Listbox, ListboxItem } from "@nextui-org/react"
import { Home, Settings, HelpCircle, MessageCircle, Mail, Users } from 'lucide-react';

const items = [
  {
    key: "getting-started",
    label: "Getting Started",
    icon: <Home className="w-5 h-5" />,
    children: [
      { key: "basic-navigation", label: "Basic Navigation" },
      { key: "document", label: "Document" },
      { key: "video", label: "Video" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { key: "profile-settings", label: "Profile Settings" },
      { key: "ai-settings", label: "AI Settings" },
      { key: "chatbot-settings", label: "Chatbot Settings" },
      { key: "wapp-settings", label: "WApp Settings" },
    ],
  },
  {
    key: "forum",
    label: "Forum",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    key: "community",
    label: "Community",
    icon: <Users className="w-5 h-5" />,
  },
  {
    key: "contact",
    label: "Contact Support",
    icon: <Mail className="w-5 h-5" />,
  },
];


export default function Sidebar({ activeItem, setActiveItem, isOpen, setIsOpen }) {
  return (
    <div className={`pt-2 bg-white shadow-md min-h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'} sm:w-64`}>
      {isOpen && (
        <div className="flex justify-between items-center p-4 sm:hidden">
          <h2 className="font-bold">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
      )}
      <Listbox
        aria-label="Support Menu"
        onAction={(key) => setActiveItem(key)}
        className="p-0 text-gray-700"
      >
        {items.flatMap((item) => [
          <ListboxItem
            key={item.key}
            startContent={item.icon}
            className={`py-2 ${activeItem === item.label ? 'bg-blue-100' : ''}`}
          >
            {item.label}
          </ListboxItem>,
          ...(item.children
            ? item.children.map((child) => (
                <ListboxItem
                  key={child.key}
                  className={`py-1 pl-10 ${
                    activeItem === child.label ? 'bg-blue-100' : ''
                  }`}
                >
                  {child.label}
                </ListboxItem>
              ))
            : [])
        ])}
      </Listbox>
    </div>
  )
}

