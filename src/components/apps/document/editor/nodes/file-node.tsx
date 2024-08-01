import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import axios from "axios";
import styled from "@emotion/styled";
import { FiFile, FiDownload, FiExternalLink } from "react-icons/fi";

const StyleWrapper = styled(NodeViewWrapper)`
  margin: 1em 0;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const FileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1em;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
`;

const FileInfo = styled.div`
  flex-grow: 1;
  margin-left: 1em;
`;

const FileName = styled.span`
  font-weight: 600;
  color: #495057;
`;

const FileSize = styled.span`
  font-size: 0.85em;
  color: #6c757d;
  margin-left: 0.5em;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5em;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #6c757d;
  transition: color 0.2s ease;

  &:hover {
    color: #212529;
  }
`;

const CaptionWrapper = styled(NodeViewContent)`
  margin-top: 0.5em;
  font-style: italic;
  color: #6c757d;
`;

const FileNode = (props: any) => {
  const imageUrl = props.node.attrs.url || props.node.attrs.src;
  const [fileSize, setFileSize] = React.useState<string | null>(null);

  React.useEffect(() => {
    replaceFile();
  }, []);

  function setImage(url: any) {
    props.updateAttributes({
      url: url,
    });
  }

  function replaceFile() {
    if (
      !props.node.attrs.url?.startsWith("blob:") &&
      !props.node.attrs.forceUpload
    ) {
      return;
    }
    handleUpload();
  }

  function startLoader() {
    props.updateAttributes({
      loading: true,
    });
  }

  function stopLoader() {
    props.updateAttributes({
      loading: false,
    });
  }

  function handleUpload() {
    startLoader();
    uploadFile();
  }

  function formatData() {
    let formData = new FormData();
    if (props.node.attrs.file) {
      let formName = props.extension.options.upload_formName || "file";
      formData.append(formName, props.node.attrs.file);
    } else {
      formData.append("url", props.node.attrs.src);
    }
    return formData;
  }

  function uploadFile() {
    if (props.extension.options.upload_handler) {
      return props.extension.options.upload_handler(
        formatData().get("file"),
        props
      );
    }

    if (!props.extension.options.upload_url) {
      stopLoader();
      return;
    }

    function getUploadUrl() {
      let url = props.extension.options.upload_url;
      if (typeof url === "function") {
        return url();
      } else {
        return url;
      }
    }

    function getUploadHeaders() {
      return props.extension.options.upload_headers || {};
    }

    axios({
      method: "post",
      url: getUploadUrl(),
      headers: getUploadHeaders(),
      data: formatData(),
      onUploadProgress: (e) => {
        updateProgressBar(e);
      },
    })
      .then((result) => {
        uploadCompleted(result.data.url);
        if (props.extension.options.upload_callback) {
          props.extension.options.upload_callback(result, props);
        }
      })
      .catch((error) => {
        console.error(`ERROR: got error uploading file ${error}`);
        if (props.extension.options.upload_error_callback) {
          props.extension.options.upload_error_callback(error, props);
        }
      })
      .finally(() => {
        stopLoader();
      });
  }

  function uploadCompleted(url: any) {
    setImage(url);
  }

  function updateProgressBar(e: any) {
    let complete = props.node.attrs.loading_progress;
    if (e.lengthComputable) {
      complete = (e.loaded / e.total) * 100;
      props.updateAttributes({ loading_progress: complete });
    }
  }

  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    try {
      const response = await axios.head(imageUrl);
      const contentType = response.headers["content-type"];

      if (contentType && contentType.startsWith("application/pdf")) {
        // Open PDF in new tab
        window.open(imageUrl, "_blank", "noopener,noreferrer");
      } else {
        // Download other file types
        downloadFile(imageUrl, getFileNameFromUrl(imageUrl));
      }
    } catch (error) {
      console.error("Error fetching file information:", error);
      // Fallback to download the file on error
      downloadFile(imageUrl, getFileNameFromUrl(imageUrl));
    }
  }

  function downloadFile(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getFileNameFromUrl(url: any) {
    if (!url.includes("://")) return url.split("/").pop();

    try {
      let urlObject = new URL(url);
      const pathname = urlObject.pathname;
      const blobRegex = /^\/([a-zA-Z0-9-_.]+\/){2}([a-zA-Z0-9-_.]+)$/;

      if (blobRegex.test(pathname)) {
        const blobFileName =
          urlObject.searchParams.get("filename") || "blob-file";
        return blobFileName;
      } else {
        const segments = pathname.split("/");
        const fileName = segments.pop();
        return fileName || "unknown-file";
      }
    } catch (error) {
      return url.split("/").pop() || "unknown-file";
    }
  }

    const fetchFileSize = async () => {
    try {
      const response = await axios.head(imageUrl);
      const contentLength = response.headers["content-length"];
      if (contentLength) {
        const size = formatFileSize(parseInt(contentLength, 10));
        setFileSize(size);
      }
    } catch (error) {
      console.error("Error fetching file size:", error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    downloadFile(imageUrl, getFileNameFromUrl(imageUrl));
  };

  const handleOpenNewTab = (event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <StyleWrapper selected={props.selected} data-drag-handle="true">
      <FileContainer onClick={handleClick}>
        <FiFile size={24} color="#4dabf7" />
        <FileInfo>
          <FileName>{getFileNameFromUrl(imageUrl)}</FileName>
          {fileSize && <FileSize>({fileSize})</FileSize>}
        </FileInfo>
        <ActionButtons>
          <ActionButton onClick={handleDownload} title="Download">
            <FiDownload size={18} />
          </ActionButton>
          <ActionButton onClick={handleOpenNewTab} title="Open in new tab">
            <FiExternalLink size={18} />
          </ActionButton>
        </ActionButtons>
      </FileContainer>
      <CaptionWrapper>
        {props.node.content.size === 0 && (
          <span className="danteDefaultPlaceholder">
            Type a caption (optional)
          </span>
        )}
      </CaptionWrapper>
    </StyleWrapper>
  );
};

const FileNodeOptions = {
  name: "FileNode",
  tag: "file-node",
  component: FileNode,
  atom: false,
  draggable: true,
  attributes: {
    url: { default: null },
    src: { default: null },
    width: { default: "" },
    height: { default: "" },
    loading: { default: false },
    loading_progress: { default: 0 },
    caption: { default: null },
    direction: { default: "center" },
    file: { default: null },
    forceUpload: { default: false },
    aspect_ratio: {
      default: {
        width: 200,
        height: 200,
        ratio: 100,
      },
    },
  },
  dataSerializer: (data: any) => {
    return {
      ...data,
      src: data.url,
      aspect_ratio: JSON.stringify(data.aspect_ratio),
      file: null,
    };
  },
  options: {
    upload_handler: (file: any, ctx: any) => {
      console.log("UPLOADED FILE", file);
    },
  },
  parseHTML: [
    {
      tag: "file-node[url]",
    },
  ],
  widget_options: {
    displayOnInlineTooltip: true,
    insertion: "upload",
    insert_block: "FileNode",
    file_types: "*",
  },
  keyboardShortcuts: (editor: any) => {
    return {
      Enter: ({ editor }: { editor: any }) => {
        if (editor.isActive("FileNode")) {
          editor.commands.insertContent({
            type: "paragraph",
          });
          editor.chain().focus().toggleNode("paragraph", "paragraph", {}).run();
          return true;
        }
      },
    };
  },
};

export { FileNode, FileNodeOptions };
