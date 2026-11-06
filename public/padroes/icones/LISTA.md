# Ícones de interface (estáticos)

SVG de traço 24x24, stroke currentColor (herdam a cor do texto). Mesma geometria Lucide dos ícones animados do animateicons (aba 13 mostra a versão animada). Uso: `<img src="../icones/ui/bell.svg">` ou SVG inline para herdar cor.

## ui/ (69)
- archive
- arrow-down
- arrow-right
- arrow-up
- arrow-up-down
- bell
- building-2
- calendar
- calendar-days
- chart-line
- check
- check-check
- chevron-down
- chevron-left
- chevron-right
- chevron-up
- circle-alert
- circle-check
- clock
- copy
- download
- ellipsis
- external-link
- eye
- eye-off
- file-text
- funnel (filter do Lucide)
- grip-vertical
- image
- info
- layout-dashboard
- list-filter
- loader-circle
- lock
- log-out
- mail
- menu
- message-circle
- mic
- minus
- moon
- panel-left
- paperclip
- pause
- pencil
- phone
- play
- plus
- refresh-cw
- save
- search
- send
- settings
- smile
- star
- sun
- tag
- trash-2
- trending-down
- trending-up
- triangle-alert
- upload
- user
- user-plus
- users
- volume-2
- volume-x
- wifi-off
- x

## origens/ (colorido, nomes fixos)
meta, google (G oficial 4 cores), whatsapp, site, bio, indicacao, google-organico (A: G pequeno + folha), google-organico-b (B: lupa)

## empresas/ (copiados de ID-Visual-ALL, só leitura lá)
- You: you-logo.svg, you-logo-claro.svg (fundo escuro), you.svg, you-icone-claro.svg
- Beec: beec-logo.svg, beec-logo-claro.svg, beec.svg, beec-icone-claro.svg
- Winny: winny-logo.svg (bicolor), winny-logo-claro.svg (branca), winny.svg, winny-icone-claro.svg
- Realizze: realizze-logo.png, realizze-logo-claro.png, realizze.png (PNG quadrado com fundo, sem vetor)
- Lavoro Piu: lavoro-piu-logo.png, lavoro-piu-logo-claro.png (PNG com fundo, sem vetor)
- NeoWear: neowear-logo.png (é a logo de referência feita pelo Nicolas, sem versão final nem vetor)
- Tu Ecom: tu-ecom.svg (símbolo do manual HTML, provisório; a pasta só tem manual e PDF do CNPJ)
- BL: SEM LOGO (a pasta só tem design system e inventário, nenhum arquivo de marca)

## Animados (icones/animateicons.js)
São os componentes REAIS do animateicons (@animateicons/react, lucide), sem mudar nada, montados em bundle local (React embutido). O script troca sozinho o `<svg class="ico"><use href="#nome"/></svg>` dos ícones-chave pelo componente; anima ao passar o mouse, focar e clicar no botão/link que o contém (usa startAnimation e stopAnimation deles). Reduced-motion: o próprio componente não anima. `window.crmAnimados.tocar(raiz)` toca de propósito (a aba 13 usa).
Nosso nome do sprite -> componente deles (todos de `@animateicons/react/lucide`):
- archive -> ArchiveIcon
- arrow-down -> ArrowDownIcon
- arrow-right -> ArrowRightIcon
- arrow-up -> ArrowUpIcon
- arrow-up-down -> ArrowUpDownIcon
- bell -> BellIcon
- building-2 -> Building2Icon
- calendar -> CalendarIcon
- calendar-days -> CalendarDaysIcon
- chart-line -> ChartLineIcon
- check -> CheckIcon
- check-check -> CheckCheckIcon
- chevron-down -> ChevronDownIcon
- chevron-left -> ChevronLeftIcon
- chevron-right -> ChevronRightIcon
- chevron-up -> ChevronUpIcon
- circle-alert -> CircleAlertIcon
- circle-check -> CircleCheckIcon
- clock -> ClockIcon
- copy -> CopyIcon
- download -> DownloadIcon
- ellipsis -> EllipsisIcon
- external-link -> ExternalLinkIcon
- eye -> EyeIcon
- eye-off -> EyeOffIcon
- file-text -> FileTextIcon
- funnel -> FilterIcon
- grip-vertical -> GripVerticalIcon
- image -> ImageIcon
- info -> InfoIcon
- layout-dashboard -> LayoutDashboardIcon
- list-filter -> ListFilterIcon
- loader-circle -> LoaderCircleIcon
- lock -> LockIcon
- log-out -> LogOutIcon
- mail -> MailIcon
- menu -> MenuIcon
- message-circle -> MessageCircleIcon
- mic -> MicIcon
- minus -> MinusIcon
- moon -> MoonIcon
- panel-left -> PanelLeftIcon
- paperclip -> PaperclipIcon
- pause -> PauseIcon
- pencil -> PencilIcon
- phone -> PhoneIcon
- play -> PlayIcon
- plus -> PlusIcon
- refresh-cw -> RefreshCwIcon
- save -> SaveIcon
- search -> SearchIcon
- send -> SendIcon
- settings -> SettingsIcon
- star -> StarIcon
- sun -> SunIcon
- tag -> TagIcon
- trash-2 -> Trash2Icon
- trending-down -> TrendingDownIcon
- trending-up -> TrendingUpIcon
- triangle-alert -> TriangleAlertIcon
- upload -> UploadIcon
- user -> UserIcon
- user-plus -> UserPlusIcon
- users -> UsersIcon
- volume-2 -> Volume2Icon
- volume-x -> VolumeXIcon
- wifi-off -> WifiOffIcon
- x -> XIcon

Ficam animando só os ícones-chave: bell search list-filter funnel ellipsis plus send mic paperclip copy trash-2 pencil refresh-cw calendar calendar-days check check-check circle-check wifi-off volume-2 volume-x log-out download upload layout-dashboard users message-circle. Os outros ficam parados de propósito.
Sem animado no pacote (fica estático): smile (só existe no conjunto huge, de outro estilo).
funnel é o filter do Lucide, por isso usa FilterIcon.
