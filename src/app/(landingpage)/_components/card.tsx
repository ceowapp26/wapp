"use client";
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Image from 'next/image';

const IntroSection = () => {
  return (
    <section id="intro" className="panel users">
      <div className="pn-title title-txt title-pn-users">
        <h2>
          Everyone can use K2EDU
        </h2>
      </div>
      <div className="logo-radiant">
        <a href="#section1" id="A_1" className="scrolldown">
          <Image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANAgMAAADUPqbNAAAADFBMVEX////////////////1pQ5zAAAAA3RSTlMAf4C/aSLHAAAAR0lEQVQIHQXBsRVAMBQAwOM9T5EhtLqswAY2YjJZQafNEAqNfHcGbKZF99gv46c8piZ/9leKNao+7jgo0ZDjRYqKPg44wcwPESEZJFQtW9IAAAAASUVORK5CYII="
            alt="See how you can make in Digital Invoice invoices"
            id="IMG_2"
            width={20}
            height={20}
          />
        </a>
        <svg id="waves">
          <g stroke="lime" strokeWidth="1px" fill="transparent">
            <circle cx="50%" cy="50%" r="10">
              <animate
                attributeType="CSS"
                attributeName="opacity"
                from="0"
                to="1"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeType="CSS"
                attributeName="r"
                from="10"
                to="19.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="20">
              <animate
                attributeType="CSS"
                attributeName="r"
                from="20"
                to="29.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="30">
              <animate
                attributeType="CSS"
                attributeName="r"
                from="30"
                to="39.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="40">
              <animate
                attributeType="CSS"
                attributeName="r"
                from="40"
                to="49.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="50">
              <animate
                attributeType="CSS"
                attributeName="r"
                from="50"
                to="59.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="60">
              <animate
                attributeType="CSS"
                attributeName="opacity"
                from="1"
                to=".5"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeType="CSS"
                attributeName="r"
                from="60"
                to="69.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50%" cy="50%" r="70">
              <animate
                attributeType="CSS"
                attributeName="opacity"
                from=".5"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeType="CSS"
                attributeName="r"
                from="70"
                to="80"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>
      <div className="wrapper">
        <div className="pn-grid ba-one ba-grid ba-anim">
          <div className="pn-inner"></div>
          <div className="pn-content">
            <div className="pn-text">
              <h2>STUDENTS</h2>
              <p>K2Edu provides the best education tools for students.</p>
            </div>
            <div className="pn-img">
              <Image
                src="/global/images/users/graduate-preview.png"
                alt="Student"
                width={200}
                height={200}
                style={{
                  position: 'relative',
                  display: 'block',
                  left: 0,
                  marginTop: '-50%',
                }}
              />
            </div>
          </div>
        </div>
        <div className="pn-grid ba-two ba-grid ba-anim">
          <Image
            src="/global/images/users/navigator-preview.png"
            alt="Navigator"
            width={250}
            height={250}
            style={{
              position: 'relative',
              display: 'block',
              left: 0,
              top: '-20%',
            }}
          />
        </div>
        <div className="pn-grid ba-three ba-grid ba-anim">
          <Image
            src="/global/images/users/educator-preview.png"
            alt="Educator"
            width={250}
            height={250}
            style={{
              position: 'relative',
              display: 'block',
              left: 0,
              top: 0,
            }}
          />
        </div>
        <div className="pn-grid ba-four ba-grid ba-anim">
          <Image
            src="/global/images/users/key-preview.png"
            alt="Key"
            width={250}
            height={250}
            style={{
              position: 'relative',
              display: 'block',
              left: 0,
              top: 0,
            }}
          />
        </div>
      </div>
      <div
        className="lineHolder line-vertical"
        style={{
          width: '4px',
          height: '100%',
          position: 'absolute',
          display: 'block',
          opacity: 0.5,
          left: '48%',
          top: 0,
          background: '#222',
          overflow: 'hidden',
        }}
      >
        <div
          data-w-id="410c138d-dd00-cb22-1156-385e8e62fb55"
          className="split-gradient-vertical"
          style={{
            width: '2px',
            height: '300px',
            position: 'absolute',
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0px) scale3d(1, 0.11816, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
            display: 'block',
            opacity: 1,
            left: '10%',
            top: 0,
            background: 'linear-gradient(-45deg, rgba(246, 255, 0, .8), rgba(255, 0, 161, .8)) fixed',
            zIndex: 55,
          }}
        ></div>
      </div>
      <div
        className="lineHolder line-horizontal"
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '4px',
          position: 'absolute',
          display: 'block',
          opacity: 0.5,
          marginLeft: '10%',
          marginTop: '48%',
          background: '#222',
          overflow: 'hidden',
        }}
      >
        <div
          data-w-id="410c138d-dd00-cb22-1156-385e8e62fb55"
          className="split-gradient-horizontal"
          style={{
            width: '300px',
            height: '2px',
            position: 'absolute',
            willChange: 'transform',
            transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
            transformStyle: 'preserve-3d',
            display: 'block',
            opacity: 1,
            left: '10%',
            top: 0,
            background: 'linear-gradient(-45deg, rgba(246, 255, 0, .8), rgba(255, 0, 161, .8)) fixed',
            zIndex: 55,
          }}
        ></div>
      </div>
    </section>
  );
};

export default IntroSection;
