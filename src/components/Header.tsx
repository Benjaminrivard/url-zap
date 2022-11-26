import { createStyles, Header, Container } from "@mantine/core";
import { IconBolt } from "@tabler/icons";

import ThemeToggle from "./ThemeToggle";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
}));

export default function HeaderSimple() {
  const { classes, cx } = useStyles();

  return (
    <Header height={60}>
      <Container className={classes.header}>
        <ThemeToggle />
      </Container>
    </Header>
  );
}
