/**
 * Finds and replaces some very basic BBCode tags
 */
export const replaceBBCode = raw => {
  if (!raw || raw.length < 1) return

  let last = null
  let res = raw

  do {
    last = res
    // match simple format tags
    res = res.replace(/\[(b|i|u|s|center)\](.*?)\[\/\1\]/gs, "<$1>$2</$1>")
    res = res.replace(/\[url=(\/.+?)\](.*?)\[\/url\]/g, "<a href='$1' target='_blank' class='external'>$2</a>")
  } while (res !== last)

  // match line breaks
  res = res.replace(/\[br\]*/gs, "<br />")

  return res
}

