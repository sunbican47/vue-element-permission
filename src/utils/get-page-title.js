import defaultSettings from "@/settings";

const title = defaultSettings.title || "Vue Element Admin";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`;
  }
  return `${title}`;
}
