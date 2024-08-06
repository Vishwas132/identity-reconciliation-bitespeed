-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "linkedId" INTEGER,
    "linkPrecedence" TEXT NOT NULL DEFAULT 'secondary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_linkedId_fkey" FOREIGN KEY ("linkedId") REFERENCES "Contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
