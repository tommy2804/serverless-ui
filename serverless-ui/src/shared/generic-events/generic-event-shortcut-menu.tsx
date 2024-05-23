import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReplyOutlined from "@mui/icons-material/ReplyOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEvent } from "../../api/events-api";
import { GenericEventObj } from "../../types/generic-event";
import { useToasterContext } from "../../state/toaster-context";
import { useDialogContext } from "../../state/dialog-context";
import { useIzmeDialogContext } from "../../state/general-dialog-context";

interface GenericEventShortcutMenuProps {
  genericEventItem: GenericEventObj;
  onDeleteEvent: () => void;
}

const GenericEventShortcutMenu = ({
  genericEventItem,
  onDeleteEvent,
}: GenericEventShortcutMenuProps) => {
  const { t } = useTranslation();
  const { setDialogProps } = useIzmeDialogContext();
  const { setToasterProps } = useToasterContext();

  const openDeleteDialog = () => {
    setDialogProps({
      type: "success",
      title: t("delete-event"),
      message: t("delete-event-confirm"),
      primaryButton: t("delete"),
      primaryButtonAction: () =>
        deleteEvent(genericEventItem.id)
          .then(() => {
            onDeleteEvent();
            setToasterProps({
              type: "success",
              text: t("delete-event-success"),
            });
          })
          .catch(() => {
            setToasterProps({
              type: "error",
              text: t("delete-event-error"),
            });
          }),
      secondaryButton: t("cancel"),
    });
  };

  return (
    <div className='shortcut-menu'>
      <Link
        to={`/events/${genericEventItem.id}/overview`}
        relative='path'
        className='shortcut-menu__item'>
        <ExitToAppIcon fontSize='small' />
        <span>{t("view")}</span>
      </Link>
      <Link
        to={`/events/${genericEventItem.id}/share`}
        relative='path'
        className='shortcut-menu__item'>
        <ReplyOutlined fontSize='small' sx={{ transform: "scaleX(-1)" }} />
        <span>{t("share")}</span>
      </Link>
      <Button onClick={openDeleteDialog} className='shortcut-menu__item delete-event-btn'>
        <DeleteIcon color='error' fontSize='small' />
        <span>{t("delete")}</span>
      </Button>
    </div>
  );
};

export default GenericEventShortcutMenu;
