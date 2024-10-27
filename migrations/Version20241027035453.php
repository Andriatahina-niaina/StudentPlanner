<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241027035453 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE personal (id INT AUTO_INCREMENT NOT NULL, district_person_id INT NOT NULL, status VARCHAR(255) NOT NULL, person_nbr_presco INT NOT NULL, person_nbr_primaire INT NOT NULL, person_nbr_college INT NOT NULL, person_nbr_lycee INT NOT NULL, INDEX IDX_F18A6D84FF98F117 (district_person_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE salle_classe (id INT AUTO_INCREMENT NOT NULL, district_salle_id INT NOT NULL, salle_status_juridique VARCHAR(255) NOT NULL, salle_nbr_presco INT NOT NULL, salle_nbr_primaire INT NOT NULL, salle_nbr_college INT NOT NULL, salle_nbr_lycee INT NOT NULL, INDEX IDX_BB04636984E4D5D8 (district_salle_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE student (id INT AUTO_INCREMENT NOT NULL, district_id INT DEFAULT NULL, student_status_juridique VARCHAR(255) NOT NULL, student_nbr_presco INT NOT NULL, student_nbr_primaire INT NOT NULL, student_nbr_college INT NOT NULL, student_nbr_lycee INT NOT NULL, INDEX IDX_B723AF33B08FA272 (district_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE personal ADD CONSTRAINT FK_F18A6D84FF98F117 FOREIGN KEY (district_person_id) REFERENCES district (id)');
        $this->addSql('ALTER TABLE salle_classe ADD CONSTRAINT FK_BB04636984E4D5D8 FOREIGN KEY (district_salle_id) REFERENCES district (id)');
        $this->addSql('ALTER TABLE student ADD CONSTRAINT FK_B723AF33B08FA272 FOREIGN KEY (district_id) REFERENCES district (id)');
        $this->addSql('ALTER TABLE etablishment DROP FOREIGN KEY FK_5FB71052B08FA272');
        $this->addSql('DROP INDEX IDX_5FB71052B08FA272 ON etablishment');
        $this->addSql('ALTER TABLE etablishment ADD statu_juridique VARCHAR(255) NOT NULL, ADD presco_nombres INT NOT NULL, ADD primaire_nombres INT NOT NULL, ADD college_nombres INT NOT NULL, ADD lycee_nombres INT NOT NULL, DROP name, DROP categ_etab, DROP etab_state, CHANGE district_id district_etab_id INT NOT NULL');
        $this->addSql('ALTER TABLE etablishment ADD CONSTRAINT FK_5FB71052C4F57281 FOREIGN KEY (district_etab_id) REFERENCES district (id)');
        $this->addSql('CREATE INDEX IDX_5FB71052C4F57281 ON etablishment (district_etab_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE personal DROP FOREIGN KEY FK_F18A6D84FF98F117');
        $this->addSql('ALTER TABLE salle_classe DROP FOREIGN KEY FK_BB04636984E4D5D8');
        $this->addSql('ALTER TABLE student DROP FOREIGN KEY FK_B723AF33B08FA272');
        $this->addSql('DROP TABLE personal');
        $this->addSql('DROP TABLE salle_classe');
        $this->addSql('DROP TABLE student');
        $this->addSql('ALTER TABLE etablishment DROP FOREIGN KEY FK_5FB71052C4F57281');
        $this->addSql('DROP INDEX IDX_5FB71052C4F57281 ON etablishment');
        $this->addSql('ALTER TABLE etablishment ADD district_id INT NOT NULL, ADD categ_etab VARCHAR(255) NOT NULL, ADD etab_state VARCHAR(255) NOT NULL, DROP district_etab_id, DROP presco_nombres, DROP primaire_nombres, DROP college_nombres, DROP lycee_nombres, CHANGE statu_juridique name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE etablishment ADD CONSTRAINT FK_5FB71052B08FA272 FOREIGN KEY (district_id) REFERENCES district (id)');
        $this->addSql('CREATE INDEX IDX_5FB71052B08FA272 ON etablishment (district_id)');
    }
}
