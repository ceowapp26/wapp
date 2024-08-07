import BasicNavigation from "./basic-navigation";

export default function Content({ activeItem }) {
  return (
    <div className="flex-1 p-8">
      {activeItem === "basic-navigation" && <BasicNavigation />}
    </div>
  );
}
