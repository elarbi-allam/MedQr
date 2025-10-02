package com.medqr.backend.config.jpa;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

import java.util.Locale;

/**
 * Stratégie de nommage physique personnalisée pour convertir automatiquement
 * les noms de colonnes et de tables de camelCase à snake_case.
 */
public class CustomPhysicalNamingStrategy implements PhysicalNamingStrategy {

    // Méthode pour convertir le nom logique (camelCase) en nom physique (snake_case)
    public static final String CAMEL_CASE_TO_SNAKE_CASE_REGEX = "([a-z])([A-Z])";
    public static final String REPLACEMENT = "$1_$2";

    @Override
    public Identifier toPhysicalCatalogName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return apply(name, jdbcEnvironment);
    }

    @Override
    public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return apply(name, jdbcEnvironment);
    }

    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return apply(name, jdbcEnvironment);
    }

    @Override
    public Identifier toPhysicalSequenceName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return apply(name, jdbcEnvironment);
    }

    @Override
    public Identifier toPhysicalColumnName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return apply(name, jdbcEnvironment);
    }

    // Logique principale de conversion
    private Identifier apply(Identifier name, JdbcEnvironment jdbcEnvironment) {
        if (name == null) {
            return null;
        }

        String newName = name.getText()
                // Convertit 'firstName' en 'first_name', 'userId' en 'user_id'
                .replaceAll(CAMEL_CASE_TO_SNAKE_CASE_REGEX, REPLACEMENT)
                .toLowerCase(Locale.ROOT);

        // Retourne le nouvel identifiant physique
        return Identifier.toIdentifier(newName);
    }
}