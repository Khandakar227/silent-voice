import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function ShowQuizOverModal(props:{open: boolean, score: number, totalQuestions: number, onAction: () => void}) {
    return (
        <AlertDialog open={props.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Quiz is over</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your score is {props.score} out of {props.totalQuestions}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={props.onAction}>Go Back</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
