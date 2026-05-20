!define OTHELLO_SHORTCUT_ICON "othello-island-icon-0.1.5.ico"

!macro NSIS_HOOK_POSTINSTALL
  ${If} $NoShortcutMode <> 1
    Delete "$INSTDIR\othello-island-icon-*.ico"
    File /oname=$INSTDIR\${OTHELLO_SHORTCUT_ICON} "${__FILEDIR__}\..\..\..\..\icons\icon.ico"
    Delete "$DESKTOP\${PRODUCTNAME}.lnk"
    CreateShortcut "$DESKTOP\${PRODUCTNAME}.lnk" "$INSTDIR\${MAINBINARYNAME}.exe" "" "$INSTDIR\${OTHELLO_SHORTCUT_ICON}" 0
    !insertmacro SetLnkAppUserModelId "$DESKTOP\${PRODUCTNAME}.lnk"
    StrCpy $NoShortcutMode 1
  ${EndIf}
!macroend
