<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241107173959 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE etablishment ADD anne_scolaire DATE NOT NULL');
        $this->addSql('ALTER TABLE personal ADD anne_scolaire DATE NOT NULL');
        $this->addSql('ALTER TABLE salle_classe ADD anne_scolaire DATE NOT NULL');
        $this->addSql('ALTER TABLE student ADD anne_scolaire DATETIME NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE etablishment DROP anne_scolaire');
        $this->addSql('ALTER TABLE personal DROP anne_scolaire');
        $this->addSql('ALTER TABLE salle_classe DROP anne_scolaire');
        $this->addSql('ALTER TABLE student DROP anne_scolaire');
    }
}
