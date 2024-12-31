import StyledDiv, {StyledDivTags} from './StyledDiv';
import styles from './styles.module.scss'

export function Flex(tags:StyledDivTags) {
    return (
        <StyledDiv
            baseClassName={styles['flex']}
            tags={tags}
        />
    )
}

export function NoFlex(tags:StyledDivTags) {
    return (
        <StyledDiv
            baseClassName={styles['noflex']}
            tags={tags}
        />
    )
}
export function Center(tags:StyledDivTags) {
    return (
        <StyledDiv
            baseClassName={styles['center']}
            tags={tags}
        />
    )
}