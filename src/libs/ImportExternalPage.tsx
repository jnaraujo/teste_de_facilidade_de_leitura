import axios from "axios";
import sanitize from "sanitize-html-react";
import { NotionRenderer } from "react-notion";
import { renderToString } from "react-dom/server";
import { getDocs, getIdFromUrl } from "../services/docs";

const sanitizeOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "p",
    "a",
    "ul",
    "li",
    "strong",
    "em",
    "img",
    "br",
  ],
};

async function importNotionPageByUrl(url: string) {
  let pageIdSplit = String(url).split("-");
  const pageId = pageIdSplit[pageIdSplit.length - 1];
  const fetchUrl = `https://notion-api.splitbee.io/v1/page/${pageId}`;

  try {
    const data = (await axios.get(fetchUrl)).data;
    if (Object.keys(data).length === 0) {
      return {
        status: "error",
        message: {
          title: "A sua página do Notion não está pública.",
          description: `Na sua página do Notion, clique em "Share" no canto superior direito e depois em "Share to web".<br/><img src="/images/raw/notion_share_link.webp"/>`,
        },
      };
    }

    const notionDiv = <NotionRenderer blockMap={data} />;
    const html = renderToString(notionDiv);

    return {
      status: "success",
      html: sanitize(html, sanitizeOptions),
    };
  } catch (e) {
    return {
      status: "error",
      message: {
        title: "A sua página do Notion não foi encontrada.",
        description: `Verifique se o link está correto e desative seu AdBlock.`,
      },
    };
  }
}

async function importGoogleDocsPage(url: string | any): Promise<{
  status: string;
  html?: string;
  message?: {
    title: string;
    description: string;
  };
}> {
  const id = getIdFromUrl(url);

  if (id === "") {
    return {
      status: "error",
      message: {
        title: "O id da sua página não foi encontrado.",
        description: `Verifique se a URL indicada está correta.`,
      },
    };
  }

  try {
    const data = await getDocs(id);
    const html = sanitize(data, sanitizeOptions);

    return {
      status: "success",
      html,
    };
  } catch (e) {
    return {
      status: "error",
      message: {
        title: "Não foi possível importar seu documento.",
        description:
          "Para permitir a importação, você deve compartilhar seu documento. <br><ol><li>Abra seu documento.</li><li>No canto superior direito, clique em 'Compartilhar'.</li><li>Em 'Acesso geral', mude de 'Restrito' para 'Qualquer pessoa com o link'.</li><li>Clique em 'Concluído'.</li></ol>",
      },
    };
  }
}

export default async function handleImport(url: string) {
  const notionUrls = ["notion.so", "notion.com", "notion.site"];
  const googleDocsUrls = ["docs.google.com", "drive.google.com"];

  if (notionUrls.some((notion) => url.includes(notion))) {
    return await importNotionPageByUrl(url);
  } else if (googleDocsUrls.some((googleDocs) => url.includes(googleDocs))) {
    return await importGoogleDocsPage(url);
  }

  return {
    status: "service is not supported",
  };
}
