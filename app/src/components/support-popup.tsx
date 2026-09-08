import { MessageCircleQuestion } from "lucide-react";
import { FloatingPopup } from "@/components/floating-popup";
import { t } from "@/lib";

export const SupportPopup = () => (
  <FloatingPopup
    storageKey="supportPopupDismissedAt"
    intervalDays={14}
    icon={<MessageCircleQuestion className="mt-0.5 size-4 shrink-0" />}
    messages={[t("supportMsg1"), t("supportMsg2"), t("supportMsg3")]}
    linkText={t("supportLinkText")}
    linkHref="https://chromewebstore.google.com/detail/parents-reminder/honpenmjodkgcmmmiangohmegkobhmkh/support"
  />
);
