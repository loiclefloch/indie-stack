import useTheme from "~/hooks/useTheme";


export default function Theme() {
	const theme = useTheme()

	return <pre>{JSON.stringify(theme, null, 2)}</pre>;

}