"use client";
import * as React from "react";

type EmojiData = { baseUrl: string; emojis: Record<string, string> };
const EmojiContext = React.createContext<EmojiData>({
  baseUrl: "",
  emojis: {
    "confused-face":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018-9.94%200-18-8.059-18-18C0%208.06%208.06%200%2018%200c9.941%200%2018%208.06%2018%2018%22%2F%3E%3Cellipse%20fill%3D%22%23664500%22%20cx%3D%2211.5%22%20cy%3D%2216.5%22%20rx%3D%222.5%22%20ry%3D%223.5%22%2F%3E%3Cellipse%20fill%3D%22%23664500%22%20cx%3D%2224.5%22%20cy%3D%2216.5%22%20rx%3D%222.5%22%20ry%3D%223.5%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M12%2028c2-5%2013-5%2013-3%200%201-8-1-13%203z%22%2F%3E%3C%2Fsvg%3E",
    "grinning-face-with-smiling-eyes":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018-9.94%200-18-8.059-18-18C0%208.06%208.06%200%2018%200c9.941%200%2018%208.06%2018%2018%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M28.457%2017.797c-.06-.135-1.499-3.297-4.457-3.297-2.957%200-4.397%203.162-4.457%203.297-.092.207-.032.449.145.591.175.142.426.147.61.014.012-.009%201.262-.902%203.702-.902%202.426%200%203.674.881%203.702.901.088.066.194.099.298.099.11%200%20.221-.037.312-.109.177-.142.238-.386.145-.594zm-12%200c-.06-.135-1.499-3.297-4.457-3.297-2.957%200-4.397%203.162-4.457%203.297-.092.207-.032.449.144.591.176.142.427.147.61.014.013-.009%201.262-.902%203.703-.902%202.426%200%203.674.881%203.702.901.088.066.194.099.298.099.11%200%20.221-.037.312-.109.178-.142.237-.386.145-.594zM18%2022c-3.623%200-6.027-.422-9-1-.679-.131-2%200-2%202%200%204%204.595%209%2011%209%206.404%200%2011-5%2011-9%200-2-1.321-2.132-2-2-2.973.578-5.377%201-9%201z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M9%2023s3%201%209%201%209-1%209-1-2%204-9%204-9-4-9-4z%22%2F%3E%3C%2Fsvg%3E",
    "pleading-face":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%20fill%3D%22%23FFCC4D%22%2F%3E%3Cpath%20fill%3D%22%2365471B%22%20d%3D%22M20.996%2028.477a.978.978%200%200%201-.309-.049%208.647%208.647%200%200%200-5.375%200%201%201%200%201%201-.617-1.902%2010.633%2010.633%200%200%201%206.609%200c.525.172.813.736.643%201.26a1.002%201.002%200%200%201-.951.691Zm7.998-18.466A1.005%201.005%200%200%200%2028.011%209c-.067-.001-1.653-.056-3.304-1.707a1%201%200%201%200-1.414%201.414C25.56%2010.974%2027.901%2011%2028%2011a.995.995%200%200%200%20.994-.989ZM12.707%208.707a.998.998%200%200%200-.324-1.63%201%201%200%200%200-1.09.216C9.652%208.934%208.075%208.998%207.99%209A1%201%200%200%200%208%2011c.099%200%202.44-.026%204.707-2.293Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M24.5%2023a5.5%205.5%200%201%200%200-11%205.5%205.5%200%200%200%200%2011Z%22%2F%3E%3Cpath%20fill%3D%22%23292F33%22%20d%3D%22M24.5%2022a5%205%200%201%200%200-10%205%205%200%200%200%200%2010Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M24.337%2016.836c1.044-1.046%201.23-2.552.417-3.364-.813-.813-2.32-.625-3.363.42-1.045%201.046-1.231%202.552-.418%203.364.814.813%202.32.625%203.364-.42Zm3.288%202.845c.458-.459.54-1.12.183-1.477-.357-.357-1.019-.274-1.478.185-.458.459-.54%201.12-.183%201.477.357.357%201.019.275%201.478-.184ZM11.5%2023a5.5%205.5%200%201%200%200-11%205.5%205.5%200%200%200%200%2011Z%22%2F%3E%3Cpath%20fill%3D%22%23292F33%22%20d%3D%22M11.5%2022a5%205%200%201%200%200-10%205%205%200%200%200%200%2010Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M11.337%2016.836c1.044-1.046%201.23-2.552.417-3.364-.813-.813-2.32-.625-3.363.42-1.045%201.046-1.231%202.552-.418%203.364.814.813%202.32.625%203.364-.42Zm3.287%202.845c.46-.459.541-1.12.184-1.477-.357-.357-1.019-.274-1.478.185-.458.459-.54%201.12-.183%201.477.357.357%201.019.275%201.477-.184Z%22%2F%3E%3C%2Fsvg%3E",
    "smiling-face-with-hearts":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Ccircle%20fill%3D%22%23FFCC4D%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M16%2016.958c-.419%200-.809-.265-.949-.684-.203-.599-1.018-2.316-2.051-2.316-1.062%200-1.888%201.827-2.051%202.316-.175.523-.738.808-1.265.632-.524-.174-.807-.741-.632-1.265.125-.377%201.304-3.684%203.949-3.684s3.823%203.307%203.949%203.684c.175.524-.108%201.091-.632%201.265-.106.036-.213.052-.318.052zm10%200c-.419%200-.809-.265-.948-.684-.203-.599-1.019-2.316-2.052-2.316-1.062%200-1.889%201.827-2.052%202.316-.175.523-.736.808-1.265.632-.523-.174-.807-.741-.632-1.265.125-.377%201.304-3.684%203.948-3.684s3.823%203.307%203.948%203.684c.175.524-.108%201.091-.632%201.265-.104.036-.21.052-.315.052zm1.335%203.733c-.178-.161-.444-.171-.635-.029-.039.029-3.922%202.9-8.7%202.9-4.766%200-8.662-2.871-8.7-2.9-.191-.142-.457-.13-.635.029-.177.16-.217.424-.094.628.129.215%203.217%205.243%209.429%205.243s9.301-5.028%209.429-5.243c.123-.205.084-.467-.094-.628z%22%2F%3E%3Cpath%20fill%3D%22%23FFAC33%22%20d%3D%22M21.229%203.947c0%20.24.03.472.082.696.425%202.643%203.364%205.431%205.47%206.197%201.665-.605%203.846-2.476%204.898-4.539C29.59%203.861%2026.86%201.987%2023.75.939c-1.432.257-2.521%201.502-2.521%203.008zm-7.486%2025.131c.057-.242.09-.494.09-.754%200-1.833-1.486-3.319-3.319-3.319-1.113%200-2.094.549-2.697%201.389-.602-.839-1.584-1.389-2.697-1.389-1.241%200-2.311.689-2.88%201.698%201.824%203.295%204.65%205.957%208.068%207.574%201.637-1.351%203.131-3.307%203.435-5.199zm20.558-3.436c-.282-.95-1.152-1.647-2.194-1.647-.771%200-1.451.38-1.868.962-.417-.582-1.097-.962-1.868-.962-1.27%200-2.299%201.029-2.299%202.299%200%20.18.023.354.062.522.307%201.905%202.348%203.896%203.909%204.561%201.776-1.6%203.231-3.547%204.258-5.735z%22%2F%3E%3Cpath%20fill%3D%22%23DD2E44%22%20d%3D%22M33.625%203.269c0-1.692-1.372-3.063-3.063-3.063-1.027%200-1.933.507-2.489%201.282C27.517.713%2026.611.206%2025.584.206c-1.692%200-3.063%201.371-3.063%203.063%200%20.24.03.472.082.696.426%202.643%203.364%205.431%205.47%206.197%202.106-.766%205.044-3.554%205.469-6.196.053-.225.083-.457.083-.697zM12.208%2028.408c0-1.833-1.486-3.319-3.319-3.319-1.113%200-2.094.549-2.697%201.389-.602-.84-1.584-1.389-2.697-1.389-1.833%200-3.319%201.486-3.319%203.319%200%20.26.033.511.089.754.461%202.863%203.644%205.884%205.926%206.714%202.282-.829%205.465-3.85%205.926-6.713.058-.244.091-.496.091-.755zm23.74-2.281c0-1.27-1.029-2.299-2.299-2.299-.771%200-1.451.38-1.868.962-.417-.582-1.097-.962-1.868-.962-1.27%200-2.299%201.029-2.299%202.299%200%20.18.023.354.062.522.319%201.983%202.524%204.076%204.105%204.65%201.58-.574%203.786-2.667%204.104-4.65.04-.168.063-.342.063-.522z%22%2F%3E%3C%2Fsvg%3E",
    "star-struck":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018S0%2027.941%200%2018%208.059%200%2018%200s18%208.059%2018%2018%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M18%2021c-3.623%200-6.027-.422-9-1-.679-.131-2%200-2%202%200%204%204.595%209%2011%209%206.404%200%2011-5%2011-9%200-2-1.321-2.132-2-2-2.973.578-5.377%201-9%201z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M9%2022s3%201%209%201%209-1%209-1-2%204-9%204-9-4-9-4z%22%2F%3E%3Cpath%20fill%3D%22%23E95F28%22%20d%3D%22M15.682%204.413l-4.542.801L8.8.961C8.542.492%208.012.241%207.488.333c-.527.093-.937.511-1.019%201.039l-.745%204.797-4.542.801c-.535.094-.948.525-1.021%201.064s.211%201.063.703%201.297l4.07%201.932-.748%204.812c-.083.536.189%201.064.673%201.309.179.09.371.133.562.133.327%200%20.65-.128.891-.372l3.512-3.561%204.518%202.145c.49.232%201.074.123%201.446-.272.372-.395.446-.984.185-1.459L13.625%209.73l3.165-3.208c.382-.387.469-.977.217-1.459-.254-.482-.793-.743-1.325-.65zm4.636%200l4.542.801L27.2.961c.258-.469.788-.72%201.312-.628.526.093.936.511%201.018%201.039l.745%204.797%204.542.801c.536.094.949.524%201.021%201.063s-.211%201.063-.703%201.297l-4.07%201.932.748%204.812c.083.536-.189%201.064-.673%201.309-.179.09-.371.133-.562.133-.327%200-.65-.128-.891-.372l-3.512-3.561-4.518%202.145c-.49.232-1.074.123-1.446-.272-.372-.395-.446-.984-.185-1.459l2.348-4.267-3.165-3.208c-.382-.387-.469-.977-.217-1.459.255-.482.794-.743%201.326-.65z%22%2F%3E%3C%2Fsvg%3E",
  },
});
function EmojiProvider({
  data,
  children,
}: {
  data: EmojiData;
  children: React.ReactNode;
}) {
  return <EmojiContext.Provider value={data}>{children}</EmojiContext.Provider>;
}
function Emoji({
  name,
  ...props
}: React.ComponentProps<"img"> & { name: string }) {
  const data = React.useContext(EmojiContext);
  const file = data.emojis[name];
  return (
    <img
      {...props}
      src={file?.startsWith("data:") ? file : data.baseUrl + file}
      alt={name.replaceAll("-", " ")}
    />
  );
}

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { ComponentProps, KeyboardEvent } from "react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

// only the default set, the full emoji map ships 380kb of json
const DEFAULT_EMOJI_DATA: EmojiData = {
  baseUrl: "",
  emojis: {
    "confused-face":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018-9.94%200-18-8.059-18-18C0%208.06%208.06%200%2018%200c9.941%200%2018%208.06%2018%2018%22%2F%3E%3Cellipse%20fill%3D%22%23664500%22%20cx%3D%2211.5%22%20cy%3D%2216.5%22%20rx%3D%222.5%22%20ry%3D%223.5%22%2F%3E%3Cellipse%20fill%3D%22%23664500%22%20cx%3D%2224.5%22%20cy%3D%2216.5%22%20rx%3D%222.5%22%20ry%3D%223.5%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M12%2028c2-5%2013-5%2013-3%200%201-8-1-13%203z%22%2F%3E%3C%2Fsvg%3E",
    "grinning-face-with-smiling-eyes":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018-9.94%200-18-8.059-18-18C0%208.06%208.06%200%2018%200c9.941%200%2018%208.06%2018%2018%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M28.457%2017.797c-.06-.135-1.499-3.297-4.457-3.297-2.957%200-4.397%203.162-4.457%203.297-.092.207-.032.449.145.591.175.142.426.147.61.014.012-.009%201.262-.902%203.702-.902%202.426%200%203.674.881%203.702.901.088.066.194.099.298.099.11%200%20.221-.037.312-.109.177-.142.238-.386.145-.594zm-12%200c-.06-.135-1.499-3.297-4.457-3.297-2.957%200-4.397%203.162-4.457%203.297-.092.207-.032.449.144.591.176.142.427.147.61.014.013-.009%201.262-.902%203.703-.902%202.426%200%203.674.881%203.702.901.088.066.194.099.298.099.11%200%20.221-.037.312-.109.178-.142.237-.386.145-.594zM18%2022c-3.623%200-6.027-.422-9-1-.679-.131-2%200-2%202%200%204%204.595%209%2011%209%206.404%200%2011-5%2011-9%200-2-1.321-2.132-2-2-2.973.578-5.377%201-9%201z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M9%2023s3%201%209%201%209-1%209-1-2%204-9%204-9-4-9-4z%22%2F%3E%3C%2Fsvg%3E",
    "pleading-face":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Ccircle%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%20fill%3D%22%23FFCC4D%22%2F%3E%3Cpath%20fill%3D%22%2365471B%22%20d%3D%22M20.996%2028.477a.978.978%200%200%201-.309-.049%208.647%208.647%200%200%200-5.375%200%201%201%200%201%201-.617-1.902%2010.633%2010.633%200%200%201%206.609%200c.525.172.813.736.643%201.26a1.002%201.002%200%200%201-.951.691Zm7.998-18.466A1.005%201.005%200%200%200%2028.011%209c-.067-.001-1.653-.056-3.304-1.707a1%201%200%201%200-1.414%201.414C25.56%2010.974%2027.901%2011%2028%2011a.995.995%200%200%200%20.994-.989ZM12.707%208.707a.998.998%200%200%200-.324-1.63%201%201%200%200%200-1.09.216C9.652%208.934%208.075%208.998%207.99%209A1%201%200%200%200%208%2011c.099%200%202.44-.026%204.707-2.293Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M24.5%2023a5.5%205.5%200%201%200%200-11%205.5%205.5%200%200%200%200%2011Z%22%2F%3E%3Cpath%20fill%3D%22%23292F33%22%20d%3D%22M24.5%2022a5%205%200%201%200%200-10%205%205%200%200%200%200%2010Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M24.337%2016.836c1.044-1.046%201.23-2.552.417-3.364-.813-.813-2.32-.625-3.363.42-1.045%201.046-1.231%202.552-.418%203.364.814.813%202.32.625%203.364-.42Zm3.288%202.845c.458-.459.54-1.12.183-1.477-.357-.357-1.019-.274-1.478.185-.458.459-.54%201.12-.183%201.477.357.357%201.019.275%201.478-.184ZM11.5%2023a5.5%205.5%200%201%200%200-11%205.5%205.5%200%200%200%200%2011Z%22%2F%3E%3Cpath%20fill%3D%22%23292F33%22%20d%3D%22M11.5%2022a5%205%200%201%200%200-10%205%205%200%200%200%200%2010Z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M11.337%2016.836c1.044-1.046%201.23-2.552.417-3.364-.813-.813-2.32-.625-3.363.42-1.045%201.046-1.231%202.552-.418%203.364.814.813%202.32.625%203.364-.42Zm3.287%202.845c.46-.459.541-1.12.184-1.477-.357-.357-1.019-.274-1.478.185-.458.459-.54%201.12-.183%201.477.357.357%201.019.275%201.477-.184Z%22%2F%3E%3C%2Fsvg%3E",
    "smiling-face-with-hearts":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Ccircle%20fill%3D%22%23FFCC4D%22%20cx%3D%2218%22%20cy%3D%2218%22%20r%3D%2218%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M16%2016.958c-.419%200-.809-.265-.949-.684-.203-.599-1.018-2.316-2.051-2.316-1.062%200-1.888%201.827-2.051%202.316-.175.523-.738.808-1.265.632-.524-.174-.807-.741-.632-1.265.125-.377%201.304-3.684%203.949-3.684s3.823%203.307%203.949%203.684c.175.524-.108%201.091-.632%201.265-.106.036-.213.052-.318.052zm10%200c-.419%200-.809-.265-.948-.684-.203-.599-1.019-2.316-2.052-2.316-1.062%200-1.889%201.827-2.052%202.316-.175.523-.736.808-1.265.632-.523-.174-.807-.741-.632-1.265.125-.377%201.304-3.684%203.948-3.684s3.823%203.307%203.948%203.684c.175.524-.108%201.091-.632%201.265-.104.036-.21.052-.315.052zm1.335%203.733c-.178-.161-.444-.171-.635-.029-.039.029-3.922%202.9-8.7%202.9-4.766%200-8.662-2.871-8.7-2.9-.191-.142-.457-.13-.635.029-.177.16-.217.424-.094.628.129.215%203.217%205.243%209.429%205.243s9.301-5.028%209.429-5.243c.123-.205.084-.467-.094-.628z%22%2F%3E%3Cpath%20fill%3D%22%23FFAC33%22%20d%3D%22M21.229%203.947c0%20.24.03.472.082.696.425%202.643%203.364%205.431%205.47%206.197%201.665-.605%203.846-2.476%204.898-4.539C29.59%203.861%2026.86%201.987%2023.75.939c-1.432.257-2.521%201.502-2.521%203.008zm-7.486%2025.131c.057-.242.09-.494.09-.754%200-1.833-1.486-3.319-3.319-3.319-1.113%200-2.094.549-2.697%201.389-.602-.839-1.584-1.389-2.697-1.389-1.241%200-2.311.689-2.88%201.698%201.824%203.295%204.65%205.957%208.068%207.574%201.637-1.351%203.131-3.307%203.435-5.199zm20.558-3.436c-.282-.95-1.152-1.647-2.194-1.647-.771%200-1.451.38-1.868.962-.417-.582-1.097-.962-1.868-.962-1.27%200-2.299%201.029-2.299%202.299%200%20.18.023.354.062.522.307%201.905%202.348%203.896%203.909%204.561%201.776-1.6%203.231-3.547%204.258-5.735z%22%2F%3E%3Cpath%20fill%3D%22%23DD2E44%22%20d%3D%22M33.625%203.269c0-1.692-1.372-3.063-3.063-3.063-1.027%200-1.933.507-2.489%201.282C27.517.713%2026.611.206%2025.584.206c-1.692%200-3.063%201.371-3.063%203.063%200%20.24.03.472.082.696.426%202.643%203.364%205.431%205.47%206.197%202.106-.766%205.044-3.554%205.469-6.196.053-.225.083-.457.083-.697zM12.208%2028.408c0-1.833-1.486-3.319-3.319-3.319-1.113%200-2.094.549-2.697%201.389-.602-.84-1.584-1.389-2.697-1.389-1.833%200-3.319%201.486-3.319%203.319%200%20.26.033.511.089.754.461%202.863%203.644%205.884%205.926%206.714%202.282-.829%205.465-3.85%205.926-6.713.058-.244.091-.496.091-.755zm23.74-2.281c0-1.27-1.029-2.299-2.299-2.299-.771%200-1.451.38-1.868.962-.417-.582-1.097-.962-1.868-.962-1.27%200-2.299%201.029-2.299%202.299%200%20.18.023.354.062.522.319%201.983%202.524%204.076%204.105%204.65%201.58-.574%203.786-2.667%204.104-4.65.04-.168.063-.342.063-.522z%22%2F%3E%3C%2Fsvg%3E",
    "star-struck":
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2036%2036%22%3E%3Cpath%20fill%3D%22%23FFCC4D%22%20d%3D%22M36%2018c0%209.941-8.059%2018-18%2018S0%2027.941%200%2018%208.059%200%2018%200s18%208.059%2018%2018%22%2F%3E%3Cpath%20fill%3D%22%23664500%22%20d%3D%22M18%2021c-3.623%200-6.027-.422-9-1-.679-.131-2%200-2%202%200%204%204.595%209%2011%209%206.404%200%2011-5%2011-9%200-2-1.321-2.132-2-2-2.973.578-5.377%201-9%201z%22%2F%3E%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M9%2022s3%201%209%201%209-1%209-1-2%204-9%204-9-4-9-4z%22%2F%3E%3Cpath%20fill%3D%22%23E95F28%22%20d%3D%22M15.682%204.413l-4.542.801L8.8.961C8.542.492%208.012.241%207.488.333c-.527.093-.937.511-1.019%201.039l-.745%204.797-4.542.801c-.535.094-.948.525-1.021%201.064s.211%201.063.703%201.297l4.07%201.932-.748%204.812c-.083.536.189%201.064.673%201.309.179.09.371.133.562.133.327%200%20.65-.128.891-.372l3.512-3.561%204.518%202.145c.49.232%201.074.123%201.446-.272.372-.395.446-.984.185-1.459L13.625%209.73l3.165-3.208c.382-.387.469-.977.217-1.459-.254-.482-.793-.743-1.325-.65zm4.636%200l4.542.801L27.2.961c.258-.469.788-.72%201.312-.628.526.093.936.511%201.018%201.039l.745%204.797%204.542.801c.536.094.949.524%201.021%201.063s-.211%201.063-.703%201.297l-4.07%201.932.748%204.812c.083.536-.189%201.064-.673%201.309-.179.09-.371.133-.562.133-.327%200-.65-.128-.891-.372l-3.512-3.561-4.518%202.145c-.49.232-1.074.123-1.446-.272-.372-.395-.446-.984-.185-1.459l2.348-4.267-3.165-3.208c-.382-.387-.469-.977-.217-1.459.255-.482.794-.743%201.326-.65z%22%2F%3E%3C%2Fsvg%3E",
  },
};

const DEFAULT_EMOJIS = Object.keys(DEFAULT_EMOJI_DATA.emojis);

const SURFACE = "bg-[var(--frost-surface,var(--surface,#fff))]";

const BURST_COUNT = 5;
const HOLD_INTERVAL = 550;
const MAX_PARTICLES = 60;
const RISE = 450;
const LAUNCH_SPREAD = 6;
const CLIMB_SPREAD = 78;
// soft ease out, roughly 65% of the distance by the halfway point so it keeps moving
const EASE = [0.4, 0.3, 0.5, 1] as const;
const SWAY = [0, 0.3, 0.65, 1];

const GAP = 16;
const EDGE = 8;

const SIZES = {
  sm: {
    trigger: "size-8",
    icon: "size-4",
    emoji: 26,
    pill: "gap-0.5 p-1",
    burst: 26,
  },
  md: {
    trigger: "size-10",
    icon: "size-5",
    emoji: 34,
    pill: "gap-1 p-1.5",
    burst: 34,
  },
  lg: {
    trigger: "size-12",
    icon: "size-6",
    emoji: 42,
    pill: "gap-1.5 p-2",
    burst: 42,
  },
} as const;

type Align = "left" | "center" | "right";

type Placement = { side: "top" | "bottom"; shift: number; tailX: number };

type Particle = {
  id: number;
  name: string;
  originX: number;
  originY: number;
  x: number;
  drift: number;
  tilt: number;
  travel: number;
  scale: number;
  blurRatio: number;
  fadeAt: number;
  duration: number;
  delay: number;
};

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn(className)}>
      <path
        d="M21 12a9 9 0 1 1-9-9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="8.9" cy="10" r="1.35" fill="currentColor" />
      <circle cx="15.1" cy="10" r="1.35" fill="currentColor" />
      <path
        d="M8 13.9a4.7 4.7 0 0 0 8 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M19 2.5v5M21.5 5h-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const label = (name: string) => name.replaceAll("-", " ");

function getPlacement(
  trigger: DOMRect,
  width: number,
  height: number,
  align: Align,
): Placement {
  const anchored =
    align === "left"
      ? trigger.left
      : align === "right"
        ? trigger.right - width
        : trigger.left + trigger.width / 2 - width / 2;

  const overhangLeft = EDGE - anchored;
  const overhangRight = anchored + width - (window.innerWidth - EDGE);
  const shift =
    overhangLeft > 0 ? overhangLeft : overhangRight > 0 ? -overhangRight : 0;

  return {
    side: trigger.top - height - GAP < EDGE ? "bottom" : "top",
    shift,
    // keeps the tail over the trigger whatever the alignment and shift are
    tailX: trigger.left + trigger.width / 2 - (anchored + shift),
  };
}

function makeParticles(
  name: string,
  seed: number,
  from: DOMRect,
  bar: DOMRect,
): Particle[] {
  const originX = from.left + from.width / 2 - bar.left;
  const originY = from.top + from.height / 2 - bar.top;

  return Array.from({ length: BURST_COUNT }, (_, i) => {
    const lane = rand(-1, 1);
    const dir = lane < 0 ? -1 : 1;
    return {
      id: seed + i,
      name,
      originX,
      originY,
      x: lane * LAUNCH_SPREAD,
      drift: lane * CLIMB_SPREAD,
      tilt: rand(1, 4) * dir,
      travel: RISE * rand(0.86, 1),
      scale: rand(0.78, 1.05),
      blurRatio: rand(0.18, 0.3),
      fadeAt: rand(0.55, 0.88),
      duration: rand(1.4, 1.8),
      delay: i * 0.25,
    };
  });
}

// memo, a parent render restarts the flight and replays its delay
const BurstEmoji = memo(function BurstEmoji({
  particle,
  size,
  onDone,
}: {
  particle: Particle;
  size: number;
  onDone: (id: number) => void;
}) {
  return (
    <motion.span
      className={cn("pointer-events-none absolute z-0 will-change-transform")}
      style={{
        left: particle.originX,
        top: particle.originY,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{
        x: particle.x,
        y: 0,
        scale: 0.6,
        opacity: 0,
        rotate: 0,
        filter: "blur(0px)",
      }}
      animate={{
        // shares the parent ease with y, any override here bends the path sideways
        x: particle.x + particle.drift,
        y: -particle.travel,
        scale: [
          0.6,
          particle.scale * 1.15,
          particle.scale,
          particle.scale * 0.75,
        ],
        rotate: [0, particle.tilt, -particle.tilt * 0.65, particle.tilt * 0.35],
        opacity: [0, 1, 1, 0],
        filter: [
          "blur(0px)",
          "blur(0px)",
          `blur(${particle.blurRatio * size}px)`,
        ],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: EASE,
        // inherit, a per value transition replaces the parent one without it
        rotate: { inherit: true, times: SWAY, ease: "easeInOut" },
        scale: { inherit: true, times: [0, 0.1, 0.22, 1], ease: "easeOut" },
        opacity: {
          inherit: true,
          times: [0, 0.03, particle.fadeAt, 1],
          ease: "linear",
        },
        // no ease override, blur has to track the climb curve or it lags the rise
        filter: { inherit: true, times: [0, 0.12, 1] },
      }}
      onAnimationComplete={() => onDone(particle.id)}
    >
      <Emoji
        name={particle.name}
        width={size}
        height={size}
        draggable={false}
        className={cn("max-w-none")}
      />
    </motion.span>
  );
});

export type EmojiReactionProps = ComponentProps<"div"> & {
  emojis?: string[];
  emojiData?: EmojiData;
  onReact?: (name: string) => void;
  size?: keyof typeof SIZES;
  align?: Align;
  asChild?: boolean;
};

export function EmojiReaction({
  emojis = DEFAULT_EMOJIS,
  emojiData = DEFAULT_EMOJI_DATA,
  onReact,
  size = "lg",
  align = "center",
  asChild = false,
  className,
  children,
  ...props
}: EmojiReactionProps) {
  const s = SIZES[size];
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [placement, setPlacement] = useState<Placement>({
    side: "top",
    shift: 0,
    tailX: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const seed = useRef(0);
  const hold = useRef<number | null>(null);
  const justOpened = useRef(false);

  // stable, an inline callback detaches every commit and is null when placeBar runs
  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node;
  }, []);

  const stopHold = useCallback(() => {
    if (hold.current === null) return;
    window.clearInterval(hold.current);
    hold.current = null;
  }, []);

  // closing unmounts the copies mid flight, so their completion never fires
  const close = useCallback(() => {
    stopHold();
    setOpen(false);
    setParticles([]);
  }, [stopHold]);

  // a ref callback, not an effect, so measuring cannot cascade an extra render pass
  const placeBar = useCallback(
    (node: HTMLDivElement | null) => {
      barRef.current = node;
      const trigger = triggerRef.current;
      if (!node || !trigger) return;
      setPlacement(
        getPlacement(
          trigger.getBoundingClientRect(),
          node.offsetWidth,
          node.offsetHeight,
          align,
        ),
      );
    },
    [align],
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  const react = useCallback(
    (name: string, from: DOMRect) => {
      setLast(name);
      onReact?.(name);

      const bar = barRef.current?.getBoundingClientRect();
      if (reduced || !bar) return;
      seed.current += BURST_COUNT;
      setParticles((prev) =>
        [...prev, ...makeParticles(name, seed.current, from, bar)].slice(
          -MAX_PARTICLES,
        ),
      );
    },
    [onReact, reduced],
  );

  const startHold = useCallback(
    (name: string, from: DOMRect) => {
      react(name, from);
      stopHold();
      hold.current = window.setInterval(() => react(name, from), HOLD_INTERVAL);
    },
    [react, stopHold],
  );

  useEffect(() => stopHold, [stopHold]);

  const settle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((particle) => particle.id !== id));
  }, []);

  // press the trigger and drag along the bar, releasing over an emoji picks it
  const onTriggerPointerDown = useCallback(() => {
    if (open) return;
    setOpen(true);
    justOpened.current = true;

    const up = (event: globalThis.PointerEvent) => {
      document.removeEventListener("pointerup", up);

      const target = document.elementFromPoint(
        event.clientX,
        event.clientY,
      ) as HTMLElement | null;

      const picked = target?.closest<HTMLElement>("[data-emoji]");
      if (picked?.dataset.emoji) {
        react(picked.dataset.emoji, picked.getBoundingClientRect());
      }

      // releasing off the trigger fires no click, so nothing else would clear the guard
      if (!triggerRef.current?.contains(target)) justOpened.current = false;
    };

    document.addEventListener("pointerup", up);
  }, [open, react]);

  const onMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const count = emojis.length;
      let next: number;

      if (event.key === "ArrowRight") next = (activeIndex + 1) % count;
      else if (event.key === "ArrowLeft")
        next = (activeIndex - 1 + count) % count;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = count - 1;
      else return;

      event.preventDefault();
      setActiveIndex(next);
      itemRefs.current[next]?.focus();
    },
    [activeIndex, emojis.length],
  );

  const burst = particles.map((particle) => (
    <BurstEmoji
      key={particle.id}
      particle={particle}
      size={s.burst}
      onDone={settle}
    />
  ));

  const Trigger = asChild ? Slot : "button";

  const top = placement.side === "top";
  const anchor =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2";
  const centering = align === "center" ? "-50%" : 0;
  // right anchored bars pin their right edge, so a left margin cannot move them
  const nudge =
    align === "right"
      ? { marginRight: -placement.shift }
      : { marginLeft: placement.shift };

  return (
    <EmojiProvider data={emojiData}>
      <div
        ref={rootRef}
        data-slot="emoji-reaction"
        className={cn("relative flex w-fit items-center", className)}
        {...props}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              className={cn(
                "absolute z-30",
                anchor,
                top ? "bottom-full mb-4" : "top-full mt-4",
              )}
              initial={{
                opacity: 0,
                y: top ? 10 : -10,
                scale: 0.85,
                x: centering,
              }}
              animate={{ opacity: 1, y: 0, scale: 1, x: centering }}
              exit={{ opacity: 0, y: top ? 6 : -6, scale: 0.9, x: centering }}
              transition={
                reduced
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 520, damping: 30 }
              }
              style={{ originY: top ? 1 : 0, ...nudge }}
            >
              <div
                ref={placeBar}
                role="menu"
                aria-label="Pick a reaction"
                aria-orientation="horizontal"
                onKeyDown={onMenuKeyDown}
                className={cn(
                  "relative flex items-center rounded-full",
                  SURFACE,
                  s.pill,
                )}
              >
                {burst}

                {emojis.map((name, i) => (
                  <motion.button
                    key={`${name}-${i}`}
                    ref={(node) => {
                      itemRefs.current[i] = node;
                    }}
                    type="button"
                    role="menuitem"
                    tabIndex={i === activeIndex ? 0 : -1}
                    data-emoji={name}
                    aria-label={label(name)}
                    onFocus={() => setActiveIndex(i)}
                    onPointerDown={(event) =>
                      startHold(
                        name,
                        event.currentTarget.getBoundingClientRect(),
                      )
                    }
                    onPointerUp={stopHold}
                    onPointerLeave={stopHold}
                    onPointerCancel={stopHold}
                    // detail is 0 only for keyboard, pointer already fired above
                    onClick={(event) =>
                      event.detail === 0 &&
                      react(name, event.currentTarget.getBoundingClientRect())
                    }
                    className={cn(
                      "relative z-10 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                    initial={reduced ? false : { scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 800,
                      damping: 25,
                      delay: reduced ? 0 : 0.04 + i * 0.035,
                    }}
                    whileHover={reduced ? undefined : { scale: 1.28, y: -4 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Emoji
                      name={name}
                      width={s.emoji}
                      height={s.emoji}
                      draggable={false}
                      className={cn("max-w-none")}
                    />
                  </motion.button>
                ))}
              </div>

              <span
                className={cn(
                  "absolute size-3 -translate-x-1/2 rounded-full",
                  SURFACE,
                  top ? "-bottom-1" : "-top-1",
                )}
                style={{ left: placement.tailX }}
              />
              <span
                className={cn(
                  "absolute size-1.5 -translate-x-1/2 rounded-full",
                  SURFACE,
                  top ? "-bottom-4" : "-top-4",
                )}
                style={{ left: placement.tailX + 6 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Trigger
          ref={setTriggerRef}
          type={asChild ? undefined : "button"}
          aria-haspopup="true"
          aria-expanded={open}
          data-dui-button="icon"
          data-dui-button-size={size}
          aria-label={
            open
              ? "Close reactions"
              : last
                ? `Reacted ${label(last)}`
                : "Add a reaction"
          }
          onPointerDown={onTriggerPointerDown}
          onClick={() => {
            if (justOpened.current) {
              justOpened.current = false;
              return;
            }
            if (open) close();
            else setOpen(true);
          }}
          className={cn(
            asChild
              ? undefined
              : cn(
                  "relative z-10 grid place-items-center rounded-full text-[var(--frost-foreground,var(--foreground,#2e3440))] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  SURFACE,
                  s.trigger,
                ),
          )}
        >
          {asChild ? (
            children
          ) : open ? (
            <X className={cn(s.icon)} strokeWidth={2} />
          ) : last ? (
            <Emoji
              name={last}
              width={s.emoji * 0.72}
              height={s.emoji * 0.72}
              draggable={false}
              className={cn("max-w-none")}
            />
          ) : (
            <SmileIcon className={cn(s.icon)} />
          )}
        </Trigger>
      </div>
    </EmojiProvider>
  );
}

export type EmojiReactionDemoProps = Partial<
  React.ComponentProps<typeof EmojiReaction>
> & { theme?: "light" | "dark" };
export default function EmojiReactionDemo({
  theme = "light",
  className,
  ...props
}: EmojiReactionDemoProps) {
  const defaults = {};
  const input = { ...defaults, ...props } as React.ComponentProps<
    typeof EmojiReaction
  >;
  return (
    <>
      <div
        className={cn(
          "dui-emoji-reaction",
          theme === "dark" && "dark",
          className,
        )}
        data-component-layout="interaction"
      >
        <EmojiReaction {...input} />
      </div>
    </>
  );
}
// This file guarantees predictable conditional class composition without runtime dependencies.

import { cn } from "../../class-names";
