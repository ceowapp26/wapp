import React from "react";
import axios from "axios";
import { Video } from 'lucide-react';
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import styled from "@emotion/styled";
import { isEmpty } from "../utils/utils";

export const StyleWrapper = styled(NodeViewWrapper)``;

export default function VideoBlock(props: any) {
  React.useEffect(() => {
    if (!isEmpty(props.node.attrs.embed_data)) {
      return;
    }
    // ensure data isnt already loaded
    if (!dataForUpdate().provisory_text) {
      return;
    }

    axios({
      method: "get",
      url: `${props.extension.options.endpoint}${
        dataForUpdate().provisory_text
      }&scheme=https`,
    })
      .then((result) => {
        updateData(result.data);
      })
      .catch((error) => {
        return console.log("TODO: error");
      });
  }, []);

  function updateData(data: any) {
    props.updateAttributes({
      embed_data: data,
    });
  }

  function dataForUpdate() {
    return props.node.attrs;
  }

  function defaultData() {
    let existing_data = props.node.attrs;
    return existing_data.embed_data || {};
  }

  function renderEmbedHtml() {
    const embed_data = parseEmbedData()

    if (dataForUpdate().mediaRenderHandler) {
      return dataForUpdate().mediaRenderHandler();
    } else {
      return embed_data.media
        ? embed_data.media.html
        : embed_data.html;
    }
  }

  function parseEmbedData(){
    if(typeof(props.node.attrs.embed_data) === "string"){
      try {
        return JSON.parse(props.node.attrs.embed_data)        
      } catch (error) {
        return {}
      }
    } else {
      return props.node.attrs.embed_data
    }
  }
  
  return (
    <StyleWrapper
      as="figure"
      data-drag-handle="true"
      className={`graf--figure graf--iframe graf--first ${
        props.selected ? "is-selected is-mediaFocused" : ""
      }`}
      tabIndex="0"
    >
      <div
        className="iframeContainer"
        dangerouslySetInnerHTML={{ __html: renderEmbedHtml() }}
      />
      <NodeViewContent as={"figcaption"} className="imageCaption">
        {props.node.content.size === 0 && (
          <span className="danteDefaultPlaceholder">
            {props.extension.options.caption}
          </span>
        )}
      </NodeViewContent>
    </StyleWrapper>
  );
}

export const VideoBlockConfig = (options = {}) => {
  let config = {
    icon: video,
    name: "VideoBlock",
    tag: "video-block",
    component: VideoBlock,
    atom: false,
    widget_options: {
      displayOnInlineTooltip: true,
      insertion: "placeholder",
      insert_block: "video",
    },
    options: {
      endpoint: "//noembed.com/embed?url=",
      placeholder:
        "Paste a YouTube, Vine, Vimeo, or other video link, and press Enter",
      caption: "Type caption for embed (optional)",
    },
    attributes: {
      embed_data: {
        default: {},
      },
      provisory_text: { default: null },
    },
    dataSerializer: (data: any)=>{
      return {
        ...data, 
        embed_data: JSON.stringify(data.embed_data),
      }
    },
  };

  return Object.assign(config, options)
};

export function VideoBlockRenderer({ blockKey, data }: { blockKey: any, data: any }) {

  
  const {embed_data, caption} = data

  function renderEmbedHtml(){
    return embed_data.media
        ? embed_data.media.html
        : embed_data.html;
  }

  return (
    <figure
      className={'graf--figure graf--iframe graf--first'}
    >
      <div
        className="iframeContainer"
        dangerouslySetInnerHTML={{ __html: renderEmbedHtml() }}
      />
      <figcaption  className="imageCaption">
        {caption &&
          <span className="danteDefaultPlaceholder">
            {caption}
          </span>
        }
      </figcaption>
    </figure>
  )
}


/*
export const VideoBlockConfig = (options={})=>{
  let config = {
      title: 'insert video',
      editable: true,
      type: 'video',
      icon: video,
      block: VideoBlock,
      renderable: true,
      breakOnContinuous: true,
      wrapper_class: "graf--figure graf--iframe",
      selected_class: " is-selected is-mediaFocused",
      widget_options: {
        displayOnInlineTooltip: true,
        insertion: "placeholder",
        insert_block: "video"
      },
      options: {
        endpoint: '//noembed.com/embed?url=',
        placeholder: 'Paste a YouTube, Vine, Vimeo, or other video link, and press Enter',
        caption: 'Type caption for embed (optional)'
      },

      handleEnterWithoutText(ctx, block) {
        const { editorState } = ctx.state
        return ctx.onChange(addNewBlockAt(editorState, block.getKey()))
      },

      handleEnterWithText(ctx, block) {
        const { editorState } = ctx.state
        return ctx.onChange(addNewBlockAt(editorState, block.getKey()))
      }
  }

  return Object.assign(config, options)
}
*/
