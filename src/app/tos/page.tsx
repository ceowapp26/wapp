"use client";

const TOSPage: React.FC = ()=> {
  return (
    <div className="main"> 
      <div id="one" className="description panel blue">
        <div>
          <h1>Navigation links with smooth scrolling</h1>
          <p>ScrollTrigger works great with navigation links within the page! Try clicking one of the links above and see how ScrollTrigger stays perfectly synced.</p>
          <div className="scroll-down">Scroll down<div className="arrow"></div></div>
        </div>
      </div>
      <section id="two" className="panel red">
        <p><span className="line line-1"></span>This line's animation will begin when it enters the viewport and finish when its top edge hits the top of the viewport, staying perfectly in sync with the scrollbar because it has <code>scrub:&nbsp;true</code></p>
      </section>

      <section id="three" className="panel orange">
        <p><span className="line line-2"></span>This orange panel gets pinned when its top edge hits the top of the viewport, then the line's animation is linked with the scroll position until it has traveled 100% of the viewport's height (<code>end: "+=100%"</code>), then the orange panel is unpinned and normal scrolling resumes. Padding is added automatically to push the rest of the content down so that it catches up with the scroll when it unpins. You can set <code>pinSpacing: false</code> to prevent that if you prefer.</p>
      </section>

      <section id="four" className="panel purple">
        <p><span className="line line-3"></span>This panel gets pinned in a similar way, and has a more involved animation that's wrapped in a timeline, fading the background color and animating the transforms of the paragraph in addition to the line, all synced with the scroll position perfectly.</p>
      </section>

      <section id="five" className="panel gray">
        DONE!
      </section>
    </div>
  );
}

TOSPage.displayName = 'TOSPage'; 

export default TOSPage;


