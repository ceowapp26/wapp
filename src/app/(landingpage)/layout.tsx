import "./base.css"

const LandingPageLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="relative h-full">
      <main className="h-full">
        {children}
      </main>
    </div>
   );
}
 
export default LandingPageLayout;