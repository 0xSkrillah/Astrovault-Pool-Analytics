// Contract address patterns to token symbols
export const ARCHWAY_TOKEN_MAPPINGS: Record<string, string> = {
  'cutfh7m87cyq5qgqqw49f289qha7vhsg6wtr6rl5fvm28ulnl9ssg0vk0n': 'xARCH',
  'm273xq2fjmn993jm4kft5c49w2c70yfv5zypt3d92cqp4n5faefqqkuf0l': 'xATOM',
  'yjdgfut7jkq5xwzyp6p5hs7hdkmszn34zkhun6mglu3falq3yh8sdkaj7j': 'xJKL',
  'ecjefhcf8r60wtfnhwefrxhj9caeqa90fj58cqsaafqveawn6cjs5znd2n': 'AXV',
  'yv8uhe795xs4fwz6mjm278yr35ps0yagjchfp39q5x49dty9jgssm5tnkv': 'xBLD',
  'veyq07az0d7mlp49sa9f9ef56w0dd240vjsy76yv0m4pl5a2x2uq698cs7': 'xDEC',
  'asgu5g79cdjcdd40lgefplszehykpwzcunx30ca4456a4tddmwcsrmtvx8': 'xFLIX',
  'h7vfp6hjjluw8n6m2v4tkfdw3getkwqldu59xghltdskt3rh6shqczumjc': 'xPLQ',
  'tl8l2gt9dncdu6huds39dsg366ctllvtnm078qkkad2mnv28erss98tl2n': 'xAKT',
  '13wj2dvr4h4cuwqftlxcdykhpw0pm7a2g542w3t608lwlcy4ctmgs4eutcn': 'xOSMO'
};

// IBC hash to token symbols
export const IBC_TOKEN_MAPPINGS: Record<string, string> = {
  '27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2': 'ATOM',
  '0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B': 'OSMO',
  'B9E4FD154C92D3A23BEA029906C4C5FF2FE74CB7E3A058290B77197A263CF88B': 'USDC.axl',
  '926432AE1C5FA4F857B36D970BE7774C7472079506820B857B75C5DE041DD7A3': 'JKL',
  'C0336ECF2DF64E7D2C98B1422EC2B38DE9EF33C34AAADF18C6F2E3FFC7BE3615': 'IST',
  '43897B9739BD63E3A08A88191999C632E052724AB96BD4C74AE31375C991F48D': 'USDC.nobl',
  'E3409E92F78AE5BF44DBC7C4741901E21EF73B7B8F98C4D48F2BD360AF242C00': 'DEC',
  '8CB56C813A5C2387140BBEAABCCE797AFA0960C8D07B171F71A5188726CFED2C': 'BLD',
  'C2CFB1C37C146CF95B0784FD518F8030FEFC76C5800105B1742FB65FFE65F873': 'AKT',
  'CFD58F8A64F93940D00CABE85B05A6D0FBA1FF4DF42D3C1E23C06DF30A2BAE1F': 'PLQ'
};

// Native token denominations
export const NATIVE_TOKENS: Record<string, string> = {
  'aarch': 'ARCH',
  'untrn': 'NTRN'
};

// Slinky price feed symbol mappings
export const PRICE_SYMBOLS: Record<string, string> = {
  'ARCH': 'ARCH/USD',
  'xARCH': 'ARCH/USD',
  'NTRN': 'NTRN/USD',
  'ATOM': 'ATOM/USD',
  'xATOM': 'ATOM/USD',
  'OSMO': 'OSMO/USD',
  'xOSMO': 'OSMO/USD',
  'USDC.nobl': 'USDC/USD',
  'USDC.axl': 'USDC/USD',
  'USDT.grav': 'USDT/USD',
  'JKL': 'JKL/USD',
  'xJKL': 'JKL/USD',
  'AXV': 'AXV/USD',
  'ETH.axl': 'ETH/USD',
  'WBTC.axl': 'BTC/USD',
  'AKT': 'AKT/USD',
  'xAKT': 'AKT/USD',
  'FLIX': 'FLIX/USD',
  'xFLIX': 'FLIX/USD',
  'PLQ': 'PLQ/USD',
  'xPLQ': 'PLQ/USD'
};

// Token decimals mapping
export const TOKEN_DECIMALS: Record<string, number> = {
  'ARCH': 18,
  'xARCH': 18,
  'NTRN': 6,
  'ATOM': 6,
  'xATOM': 6,
  'OSMO': 6,
  'xOSMO': 6,
  'USDC.nobl': 6,
  'USDC.axl': 6,
  'USDT.grav': 6,
  'JKL': 6,
  'xJKL': 6,
  'AXV': 6,
  'ETH.axl': 18,
  'WBTC.axl': 8,
  'AKT': 6,
  'xAKT': 6,
  'FLIX': 6,
  'xFLIX': 6,
  'PLQ': 18,
  'xPLQ': 18
};