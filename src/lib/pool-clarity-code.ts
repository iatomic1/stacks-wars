export const getClarityCode = (entryFee: number) => {
	return `
;; ==============================
;; Stacks Wars - Pool Contract
;; ==============================
;; A pool where players join by paying a fixed entry fee.
;; Winners are determined off-chain and claim rewards using signed messages.

;; ----------------------
;; CONSTANTS
;; ----------------------

;; Trusted signer for winner verification
(define-constant TRUSTED_SIGNER 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM) ;; TODO: Replace with the actual signer before deployment
(define-constant TRUSTED_PUBLIC_KEY 0x0390a5cac7c33fda49f70bc1b0866fa0ba7a9440d9de647fecb8132ceb76a94dfa)

;; Fixed entry fee for all players
(define-constant ENTRY_FEE u${entryFee})

;; Error codes
(define-constant ERR_ALREADY_JOINED u1)
(define-constant ERR_INSUFFICIENT_FUNDS u2)
(define-constant ERR_TRANSFER_FAILED u3)
(define-constant ERR_REWARD_ALREADY_CLAIMED u4)
(define-constant ERR_INVALID_SIGNATURE u5)
(define-constant ERR_INVALID_AMOUNT u6)
(define-constant ERR_MAXIMUM_REWARD_EXCEEDED u7)
(define-constant ERR_REENTRANCY u8)
(define-constant ERR_NOT_JOINED u9)

;; ----------------------
;; DATA VARIABLES
;; ----------------------

;; Track total balance of the pool
(define-data-var pool-balance uint u0)

;; Track total number of players
(define-data-var total-players uint u0)

;; Track players who joined the pool
(define-map players {player: principal} {joined-at: uint})

;; Track claimed rewards
(define-map claimed-rewards {player: principal} {claimed: bool, amount: uint})

;; Reentrancy guard
(define-data-var executing bool false)

;; ----------------------
;; HELPER FUNCTIONS
;; ----------------------

(define-private (begin-execution)
    (begin
        (asserts! (not (var-get executing)) (err ERR_REENTRANCY))
        (var-set executing true)
        (ok true)
    )
)

(define-private (construct-message-hash (amount uint))
    (let ((message {amount: amount, winner: tx-sender}))
        (match (to-consensus-buff? message)
            buff (ok (sha256 buff))
            (err ERR_INVALID_AMOUNT)
        )
    )
)

;; ----------------------
;; PUBLIC FUNCTIONS
;; ----------------------

;; Players join the shared pool by paying the fixed entry fee
(define-public (join-pool)
    (begin
        ;; Check if player has already joined
        (asserts! (not (is-some (map-get? players {player: tx-sender}))) (err ERR_ALREADY_JOINED))

        ;; Transfer STX from player to contract
        (match (stx-transfer? ENTRY_FEE tx-sender (as-contract tx-sender))
            success
            (begin
                ;; Record player's entry
                (map-set players {player: tx-sender} {joined-at: stacks-block-height})

                ;; Update pool balance and player count
                (var-set pool-balance (+ (var-get pool-balance) ENTRY_FEE))
                (var-set total-players (+ (var-get total-players) u1))
                (ok true)
            )
            error (err ERR_TRANSFER_FAILED)
        )
    )
)

;; Winners claim rewards using signed messages
(define-public (claim-reward (amount uint) (signature (buff 65)))
    (begin
        ;; Apply reentrancy guard
        (try! (begin-execution))

        ;; Check if reward has already been claimed
        (asserts! (not (is-some (map-get? claimed-rewards {player: tx-sender}))) (err ERR_REWARD_ALREADY_CLAIMED))

        ;; Ensure the amount doesn't exceed pool balance
        (asserts! (<= amount (var-get pool-balance)) (err ERR_MAXIMUM_REWARD_EXCEEDED))

        ;; Construct message hash for verification
        (let (
			(msg-hash (try! (construct-message-hash amount)))
			(recipient tx-sender)  ;; Store original sender in recipient
			)

            ;; Verify signature
            (asserts! (secp256k1-verify msg-hash signature TRUSTED_PUBLIC_KEY) (err ERR_INVALID_SIGNATURE))

            ;; Transfer reward to player
            (match (as-contract (stx-transfer? amount tx-sender recipient))
                success
                (begin
                    ;; Mark reward as claimed
                    (map-set claimed-rewards {player: tx-sender} {claimed: true, amount: amount})

                    ;; Update pool balance
                    (var-set pool-balance (- (var-get pool-balance) amount))

                    ;; End execution (release the reentrancy guard)
					(var-set executing false)
                    (ok true)
                )
                error
                (begin
                    ;; End execution (release the reentrancy guard)
					(var-set executing false)
                    (err ERR_TRANSFER_FAILED)
                )
            )
        )
    )
)

;; Players leave the pool and get refunded with a verified signature
(define-public (leave-pool (signature (buff 65)))
    (begin
        ;; Apply reentrancy guard
        (try! (begin-execution))

        ;; Ensure player has joined the pool
        (asserts! (is-some (map-get? players {player: tx-sender})) (err ERR_NOT_JOINED))

        ;; Construct message hash for verification
        (let (
            (msg-hash (try! (construct-message-hash ENTRY_FEE)))
            (recipient tx-sender)  ;; Store original sender in recipient
            )

            ;; Verify signature
            (asserts! (secp256k1-verify msg-hash signature TRUSTED_PUBLIC_KEY) (err ERR_INVALID_SIGNATURE))

            ;; Transfer refund to player
            (match (as-contract (stx-transfer? ENTRY_FEE tx-sender recipient))
                success
                (begin
                    ;; Remove player from the pool
                    (map-delete players {player: tx-sender})

                    ;; Update pool balance and player count
                    (var-set pool-balance (- (var-get pool-balance) ENTRY_FEE))
                    (var-set total-players (- (var-get total-players) u1))

                    ;; End execution (release the reentrancy guard)
                    (var-set executing false)
                    (ok true)
                )
                error
                (begin
                    ;; End execution (release the reentrancy guard)
                    (var-set executing false)
                    (err ERR_TRANSFER_FAILED)
                )
            )
        )
    )
)

;; ----------------------
;; READ-ONLY FUNCTIONS
;; ----------------------

;; Get total pool balance
(define-read-only (get-pool-balance)
    (var-get pool-balance)
)

;; Get total number of players
(define-read-only (get-total-players)
    (var-get total-players)
)

;; Check if a player has joined
(define-read-only (has-player-joined (player principal))
    (is-some (map-get? players {player: player}))
)

;; Check if a player has claimed their reward
(define-read-only (has-claimed-reward (player principal))
    (default-to false (get claimed (map-get? claimed-rewards {player: player})))
)
`;
};
